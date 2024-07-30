import "dotenv/config"
import { providers, Wallet, ethers } from 'ethers'
import {
    getArbitrumNetwork,
} from '@arbitrum/sdk/dist/lib/dataEntities/networks'
import {
    InboxTools, ChildTransactionReceipt,
    ChildToParentMessageStatus,
} from '@arbitrum/sdk'
import {
    ArbSys__factory,
} from '@arbitrum/sdk/dist/lib/abi/factories/ArbSys__factory'
import {
    ARB_SYS_ADDRESS,
} from '@arbitrum/sdk/dist/lib/dataEntities/constants'


enum ClaimStatus {
    PENDING = 'PENDING',
    CLAIMABLE = 'CLAIMABLE',
    CLAIMED = 'CLAIMED',
}

async function sendWithDelayedInbox(tx: any, l1Wallet: Wallet, l2Wallet: Wallet) {
    const l2Network = await getArbitrumNetwork(await l2Wallet.getChainId())
    const inboxSdk = new InboxTools(l1Wallet, l2Network)

    // extract l2's tx hash first so we can check if this tx executed on l2 later.
    const l2SignedTx = await inboxSdk.signChildTx(tx, l2Wallet)
    const l2Txhash = ethers.utils.parseTransaction(l2SignedTx).hash

    // send tx to l1 delayed inbox
    const resultsL1 = await inboxSdk.sendChildSignedTx(l2SignedTx)
    if (resultsL1 == null) {
        throw new Error(`Failed to send tx to l1 delayed inbox!`)
    }
    const inboxRec = await resultsL1.wait()

    return { l2Txhash, l1Txhash: inboxRec.transactionHash };
}

async function isForceIncludePossible(l1Wallet: Wallet, l2Wallet: Wallet) {
    const l2Network = getArbitrumNetwork(await l2Wallet.getChainId());
    const inboxSdk = new InboxTools(l1Wallet, l2Network);

    return !!(await inboxSdk.getForceIncludableEvent());
}

async function forceInclude(l1Signer: Wallet, l2Wallet: Wallet) {
    const l2Network = getArbitrumNetwork(await l2Wallet.getChainId());
    const inboxTools = new InboxTools(l1Signer, l2Network);

    const forceInclusionTx = await inboxTools.forceInclude();
    console.log("forceInclusionTx: ", forceInclusionTx);

    if (forceInclusionTx) {
        return await forceInclusionTx.wait();
    } else return null;
}

async function assembleWithdraw(from: string, amountInWei: number) {
    // Assemble a generic withdraw transaction
    const arbSys = ArbSys__factory.connect(ARB_SYS_ADDRESS, l2Provider)
    const arbsysIface = arbSys.interface
    const calldatal2 = arbsysIface.encodeFunctionData('withdrawEth', [from])

    return {
        data: calldatal2,
        to: ARB_SYS_ADDRESS,
        value: amountInWei,
    }
}

async function initiateWithdraw(l1Wallet: Wallet, l2Wallet: Wallet, amountInWei: number) {
    const bridgeTx = await assembleWithdraw(l2Wallet.address, amountInWei)
    return await sendWithDelayedInbox(bridgeTx, l1Wallet, l2Wallet)
}

async function getClaimStatus(txnHash: string, l1Wallet: Wallet, l2Provider: ethers.providers.JsonRpcProvider): Promise<ClaimStatus> {
    if (!txnHash) {
        throw new Error(
            'Provide a transaction hash of an L2 transaction that sends an L2 to L1 message'
        )
    }
    if (!txnHash.startsWith('0x') || txnHash.trim().length != 66) {
        throw new Error(`Hmm, ${txnHash} doesn't look like a txn hash...`)
    }

    // First, let's find the Arbitrum txn from the txn hash provided
    const receipt = await l2Provider.getTransactionReceipt(txnHash)
    if (receipt === null) {
        return ClaimStatus.PENDING;
    }
    const l2Receipt = new ChildTransactionReceipt(receipt)

    // In principle, a single transaction could trigger any number of outgoing messages; the common case will be there's only one.
    // We assume there's only one / just grad the first one.
    const messages = await l2Receipt.getChildToParentMessages(l1Wallet)
    const l2ToL1Msg = messages[0]

    // Check if already executed
    if ((await l2ToL1Msg.status(l2Provider)) == ChildToParentMessageStatus.EXECUTED) {
        return ClaimStatus.CLAIMED
    }

    // block number of the first block where the message can be executed or null if it already can be executed or has been executed
    const block = await l2ToL1Msg.getFirstExecutableBlock(l2Provider)
    if (block === null) {
        return ClaimStatus.CLAIMABLE
    } else {
        return ClaimStatus.PENDING
    }
}

async function claimFunds(txnHash: string, l1Wallet: Wallet, l2Provider: ethers.providers.JsonRpcProvider) {
    if (!txnHash) {
        throw new Error(
            "Provide a transaction hash of an L2 transaction that sends an L2 to L1 message"
        );
    }
    if (!txnHash.startsWith("0x") || txnHash.trim().length != 66) {
        throw new Error(`Hmm, ${txnHash} doesn't look like a txn hash...`);
    }

    // First, let's find the Arbitrum txn from the txn hash provided
    const receipt = await l2Provider.getTransactionReceipt(txnHash);
    const l2Receipt = new ChildTransactionReceipt(receipt);

    // In principle, a single transaction could trigger any number of outgoing messages; the common case will be there's only one.
    // We assume there's only one / just grad the first one.
    const messages = await l2Receipt.getChildToParentMessages(l1Wallet);
    const l2ToL1Msg = messages[0];

    // Check if already executed
    if (
        (await l2ToL1Msg.status(l2Provider)) == ChildToParentMessageStatus.EXECUTED
    ) {
        return null;
    }

    // Now that its confirmed and not executed, we can execute our message in its outbox entry.
    const res = await l2ToL1Msg.execute(l2Provider);
    const rec = await res.wait();

    console.log("Done! Your transaction is executed", rec);
    return rec;
}


if (!process.env.DEVNET_PRIVKEY) {
    throw new Error('DEVNET_PRIVKEY env variable is required')
} else if (!process.env.L2RPC) {
    throw new Error('L2RPC env variable is required')
} else if (!process.env.L1RPC) {
    throw new Error('L1RPC env variable is required')
}

const walletPrivateKey = process.env.DEVNET_PRIVKEY as string

const l1Provider = new providers.JsonRpcProvider(process.env.L1RPC)
const l2Provider = new providers.JsonRpcProvider(process.env.L2RPC)

const l1Wallet = new Wallet(walletPrivateKey, l1Provider)
const l2Wallet = new Wallet(walletPrivateKey, l2Provider)

// l2Wallet.getChainId().then(console.log)
// l2Wallet.getBalance().then(console.log)
// l1Wallet.provider.getBlock('latest').then(b => console.log(b.timestamp))


// App logic ========================================================================
// initiateWithdraw(l1Wallet, l2Wallet, 1000000000000000000)
// checkIfClaimable() -> claim()
//  else -> checkIfForceIncludePossible() -> forceInclude()


// Bridge internal tests ============================================================

// initiateWithdraw(l1Wallet, l2Wallet, 1).then(console.log)

// const l2Hash = "0xba46de8a236f34ee520aa920384d4222046858dc62bbc7e99f75854e89454770"
// const l2Hash= "0xf3b711171f2ae58b8ab0c3629dec93e49f119b3a58aa6311ac2ce23a0ad2cb0f"
// getClaimStatus(l2Hash, l1Wallet, l2Provider).then(console.log)

// isForceIncludePossible(l1Wallet, l2Wallet).then(console.log)

// forceInclude(l1Wallet, l2Wallet).then(console.log)

// claimFunds(l2Hash, l1Wallet, l2Provider).then(console.log)

// Bridge internal tests ============================================================

// async function readCount() {
//     const contract = new ethers.Contract("0x362698Add3e652B9422Ac669d4e228608C6cFecd", ["function count() view returns (uint256)"], l2Provider);

//     console.log(await contract.count())
// }


// async function incrementCount() {
//     const contract = new ethers.Contract("0x362698Add3e652B9422Ac669d4e228608C6cFecd", ["function increment() public"], l2Wallet);

//     console.log(await contract.increment())
// }

// async function incrementCountWithDelayed() {
//     const contract = new ethers.utils.Interface(["function increment() public"]);
//     const tx = {
//         to: "0x362698Add3e652B9422Ac669d4e228608C6cFecd",
//         data: await contract.encodeFunctionData("increment"),
//     }

//     return await sendWithDelayedInbox(tx, l1Wallet, l2Wallet)
// }


// // incrementCount()
// // incrementCountWithDelayed().then(console.log)
// readCount()