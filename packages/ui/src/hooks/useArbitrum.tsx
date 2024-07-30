import "@rainbow-me/rainbowkit/styles.css";
import { arbitrum, arbitrumSepolia, mainnet, sepolia } from "wagmi/chains";

import {
  ArbitrumNetwork,
  ChildToParentMessageStatus,
  ChildTransactionReceipt,
  getArbitrumNetwork,
  InboxTools,
} from "@arbitrum/sdk";
import { ArbSys__factory } from "@arbitrum/sdk/dist/lib/abi/factories/ArbSys__factory";
import { ARB_SYS_ADDRESS } from "@arbitrum/sdk/dist/lib/dataEntities/constants";
import { ethers, Wallet } from "ethers";
import { useAccount } from "wagmi";
import { useEthersSigner } from "./useEthersSigner.js";

enum ClaimStatus {
  PENDING = "PENDING",
  CLAIMABLE = "CLAIMABLE",
  CLAIMED = "CLAIMED",
}

const l2Networks = {
  [mainnet.id]: arbitrum.id,
  [sepolia.id]: arbitrumSepolia.id,
} as const;

const switchToChain = async (chainId: number) => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ethers.utils.hexValue(chainId) }],
    });
  } catch (switchError) {
    console.error("Error switching network:", switchError);
  }
};

export default function useArbitrum() {
  const { chain } = useAccount();
  const parentNetwork = sepolia;
  const childNetworkId =
    l2Networks[parentNetwork.id as keyof typeof l2Networks];
  const L1Signer = useEthersSigner({ chainId: parentNetwork.id });
  const L2Signer = useEthersSigner({
    chainId: childNetworkId,
  });

  async function sendWithDelayedInbox(tx: any) {
    if (!L2Signer || !L1Signer) return;
    const l2Network = getArbitrumNetwork(await L2Signer.getChainId());
    const inboxSdk = new InboxTools(L1Signer, l2Network);

    // extract l2's tx hash first so we can check if this tx executed on l2 later.
    if (chain?.id !== arbitrumSepolia.id) {
      await switchToChain(42161);
    }
    const l2SignedTx = await inboxSdk.signChildTx(tx, L2Signer);

    const l2Txhash = ethers.utils.parseTransaction(l2SignedTx).hash;

    // send tx to l1 delayed inbox
    const resultsL1 = await inboxSdk.sendChildSignedTx(l2SignedTx);
    if (resultsL1 == null) {
      throw new Error(`Failed to send tx to l1 delayed inbox!`);
    }
    const inboxRec = await resultsL1.wait();

    return { l2Txhash, l1Txhash: inboxRec.transactionHash };
  }

  async function isForceIncludePossible(l1Wallet: Wallet, l2Wallet: Wallet) {
    console.log("id", await l2Wallet.getChainId());
    const l2Network = getArbitrumNetwork(
      l2Networks[(await l2Wallet.getChainId()) as keyof typeof l2Networks]
    );
    const inboxSdk = new InboxTools(l1Wallet, l2Network);

    return !!(await inboxSdk.getForceIncludableEvent());
  }

  async function forceInclude(l1Signer: Wallet, l2Network: ArbitrumNetwork) {
    const inboxTools = new InboxTools(l1Signer, l2Network);

    const forceInclusionTx = await inboxTools.forceInclude();
    console.log("forceInclusionTx: ", forceInclusionTx);

    if (forceInclusionTx) {
      return await forceInclusionTx.wait();
    } else return null;
  }

  function assembleWithdraw(from: string, amountInWei: number) {
    if (!L2Signer) return;
    // Assemble a generic withdraw transaction
    const arbSys = ArbSys__factory.connect(ARB_SYS_ADDRESS, L2Signer.provider);
    const arbsysIface = arbSys.interface;
    const calldatal2 = arbsysIface.encodeFunctionData("withdrawEth", [from]);

    return {
      data: calldatal2,
      to: ARB_SYS_ADDRESS,
      value: amountInWei,
    };
  }

  async function initiateWithdraw(amountInWei: number) {
    if (!L2Signer) return;
    const bridgeTx = assembleWithdraw(await L2Signer.getAddress(), amountInWei);
    return await sendWithDelayedInbox(bridgeTx);
  }

  async function getClaimStatus(
    txnHash: string,
    l1Wallet: Wallet,
    l2Provider: ethers.providers.JsonRpcProvider
  ): Promise<ClaimStatus> {
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
    if (receipt === null) {
      return ClaimStatus.PENDING;
    }
    const l2Receipt = new ChildTransactionReceipt(receipt);

    // In principle, a single transaction could trigger any number of outgoing messages; the common case will be there's only one.
    // We assume there's only one / just grad the first one.
    const messages = await l2Receipt.getChildToParentMessages(l1Wallet);
    const l2ToL1Msg = messages[0];

    // Check if already executed
    if (
      (await l2ToL1Msg.status(l2Provider)) ==
      ChildToParentMessageStatus.EXECUTED
    ) {
      return ClaimStatus.CLAIMED;
    }

    // block number of the first block where the message can be executed or null if it already can be executed or has been executed
    const block = await l2ToL1Msg.getFirstExecutableBlock(l2Provider);
    if (block === null) {
      return ClaimStatus.CLAIMABLE;
    } else {
      return ClaimStatus.PENDING;
    }
  }

  async function claimFunds(
    txnHash: string,
    l1Wallet: Wallet,
    l2Provider: ethers.providers.JsonRpcProvider
  ) {
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
      (await l2ToL1Msg.status(l2Provider)) ==
      ChildToParentMessageStatus.EXECUTED
    ) {
      return null;
    }

    // Now that its confirmed and not executed, we can execute our message in its outbox entry.
    const res = await l2ToL1Msg.execute(l2Provider);
    const rec = await res.wait();

    console.log("Done! Your transaction is executed", rec);
    return rec;
  }

  return {
    sendWithDelayedInbox,
    isForceIncludePossible,
    forceInclude,
    assembleWithdraw,
    initiateWithdraw,
    getClaimStatus,
    claimFunds,
  } as const;
}
