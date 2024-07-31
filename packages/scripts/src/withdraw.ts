import "dotenv/config"
import { Wallet, ethers } from 'ethers'
import {
    ChildTransactionReceipt,
    ChildToParentMessageStatus,
} from '@arbitrum/sdk'
import { ArbSys__factory } from '@arbitrum/sdk/dist/lib/abi/factories/ArbSys__factory'
import { ARB_SYS_ADDRESS } from '@arbitrum/sdk/dist/lib/dataEntities/constants'

export enum ClaimStatus {
    PENDING = 'PENDING',
    CLAIMABLE = 'CLAIMABLE',
    CLAIMED = 'CLAIMED',
}

export async function assembleWithdraw(l2Provider: ethers.providers.Provider, from: string, amountInWei: number) {
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

export async function getClaimStatus(txnHash: string, l1Wallet: Wallet, l2Provider: ethers.providers.JsonRpcProvider): Promise<ClaimStatus> {
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

export async function claimFunds(txnHash: string, l1Wallet: Wallet, l2Provider: ethers.providers.JsonRpcProvider) {
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
