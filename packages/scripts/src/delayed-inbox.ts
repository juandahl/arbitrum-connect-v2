import { Wallet, ethers } from 'ethers'
import { getArbitrumNetwork } from '@arbitrum/sdk/dist/lib/dataEntities/networks'
import { InboxTools } from '@arbitrum/sdk'


export async function sendWithDelayedInbox(tx: any, l1Wallet: Wallet, l2Wallet: Wallet) {
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

export async function isForceIncludePossible(l1Wallet: Wallet, l2Wallet: Wallet) {
    const l2Network = getArbitrumNetwork(await l2Wallet.getChainId());
    const inboxSdk = new InboxTools(l1Wallet, l2Network);

    return !!(await inboxSdk.getForceIncludableEvent());
}

export async function forceInclude(l1Signer: Wallet, l2Wallet: Wallet) {
    const l2Network = getArbitrumNetwork(await l2Wallet.getChainId());
    const inboxTools = new InboxTools(l1Signer, l2Network);

    const forceInclusionTx = await inboxTools.forceInclude();
    console.log("forceInclusionTx: ", forceInclusionTx);

    if (forceInclusionTx) {
        return await forceInclusionTx.wait();
    } else return null;
}
