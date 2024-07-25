import "@rainbow-me/rainbowkit/styles.css";
import {
  arbitrum,
  arbitrumSepolia,
  Chain,
  mainnet,
  sepolia,
} from "wagmi/chains";

import { getArbitrumNetwork, InboxTools } from "@arbitrum/sdk";
import { Bridge__factory } from "@arbitrum/sdk/dist/lib/abi/factories/Bridge__factory";
import { Inbox__factory } from "@arbitrum/sdk/dist/lib/abi/factories/Inbox__factory";
import { SequencerInbox__factory } from "@arbitrum/sdk/dist/lib/abi/factories/SequencerInbox__factory";
import { BigNumber } from "@ethersproject/bignumber";
import { ContractTransaction, Signer, utils } from "ethers";

const l2Networks = {
  [mainnet.id]: arbitrum.id,
  [sepolia.id]: arbitrumSepolia.id,
} as const;

export default function useArbitrum() {
  const forceInclude = async (l1Signer: Signer, chain: Chain) => {
    const l2Network = getArbitrumNetwork(
      l2Networks[chain.id as keyof typeof l2Networks]
    );
    const sequencerInbox = SequencerInbox__factory.connect(
      l2Network.ethBridge.sequencerInbox,
      l1Signer
    );

    const bridge = Bridge__factory.connect(
      l2Network.ethBridge.bridge,
      l1Signer
    );

    const inboxTools = new InboxTools(l1Signer, l2Network);

    const messagesReadBegin = await bridge.sequencerMessageCount();

    const forceInclusionTx = await inboxTools.forceInclude();
    console.log("forceInclusionTx: ", forceInclusionTx);

    if (forceInclusionTx) {
      const result2 = await forceInclusionTx.wait();
      console.log("forceInclusionTx await: ", result2);
    }

    const messagesReadEnd = await sequencerInbox.totalDelayedMessagesRead();

    console.log(
      `Messages before: ${messagesReadBegin.toString()} / after: ${messagesReadEnd.toString()}`
    );
  };

  const submitL2Tx = async (
    l1Signer: Signer,
    chain: Chain,
    tx: {
      value: number;
      data?: string;
      nonce?: number;
      gasPriceBid?: BigNumber;
      gasLimit?: BigNumber;
    }
  ): Promise<ContractTransaction> => {
    const l2Network = getArbitrumNetwork(
      l2Networks[chain.id as keyof typeof l2Networks]
    );
    const lala = await l1Signer.getAddress();
    console.log("signer address: ", lala);
    const inbox = Inbox__factory.connect(l2Network.ethBridge.inbox, l1Signer);
    return await inbox.sendUnsignedTransaction(
      tx.gasLimit || BigNumber.from(100000),
      tx.gasPriceBid || BigNumber.from(21000000000),
      tx.nonce || 0,
      await l1Signer.getAddress(),
      utils.parseEther(tx.value.toString()),
      tx.data || "0x"
    );
  };
  return { forceInclude, submitL2Tx } as const;
}
