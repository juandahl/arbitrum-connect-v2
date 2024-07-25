import "@rainbow-me/rainbowkit/styles.css";
import { arbitrum, arbitrumSepolia, mainnet, sepolia } from "wagmi/chains";

import { ArbitrumNetwork, getArbitrumNetwork, InboxTools } from "@arbitrum/sdk";
import { Bridge__factory } from "@arbitrum/sdk/dist/lib/abi/factories/Bridge__factory";
import { Inbox__factory } from "@arbitrum/sdk/dist/lib/abi/factories/Inbox__factory";
import { SequencerInbox__factory } from "@arbitrum/sdk/dist/lib/abi/factories/SequencerInbox__factory";
import { BigNumber } from "@ethersproject/bignumber";
import { ContractTransaction, Signer, utils } from "ethers";
import useUserWallet from "./useUserWallet";

const l2Networks = {
  [mainnet.id]: arbitrum.id,
  [sepolia.id]: arbitrumSepolia.id,
} as const;

const submitL2Tx = async (
  tx: {
    to: string;
    value?: BigNumber;
    data?: string;
    nonce: number;
    gasPriceBid: BigNumber;
    gasLimit: BigNumber;
  },
  l2Network: ArbitrumNetwork,
  l1Signer: Signer
): Promise<ContractTransaction> => {
  const inbox = Inbox__factory.connect(l2Network.ethBridge.inbox, l1Signer);

  return await inbox.sendUnsignedTransaction(
    tx.gasLimit,
    tx.gasPriceBid,
    tx.nonce,
    tx.to,
    tx.value || BigNumber.from(0),
    tx.data || "0x"
  );
};

export default function useArbitrum() {
  const [l1Signer, chain] = useUserWallet();

  const forceInclude = async () => {
    if (!l1Signer || !chain) {
      return;
    }

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
    const l2Tx = await submitL2Tx(
      {
        to: await l1Signer.getAddress(),
        value: utils.parseEther("0.001"),
        gasLimit: BigNumber.from(100000),
        gasPriceBid: BigNumber.from(21000000000),
        nonce: 0,
      },
      l2Network,
      l1Signer
    );
    await l2Tx.wait();

    const forceInclusionTx = await inboxTools.forceInclude();

    if (forceInclusionTx) {
      await forceInclusionTx.wait();
    }

    const messagesReadEnd = await sequencerInbox.totalDelayedMessagesRead();

    console.log(
      `Messages before: ${messagesReadBegin.toString()} / after: ${messagesReadEnd.toString()}`
    );
  };
  return [forceInclude] as const;

  //   return (
  //     <>
  //       {isLoading && <div>Loading...</div>}
  //       {address && chain && (
  //         <div>
  //           <div>Wallet: {address}</div>
  //           <div>Chain: {chain.name}</div>
  //         </div>
  //       )}

  //       <br />

  //       {arbitrumChains.map((chain, index) => (
  //         <div key={`chain-${index}`}>
  //           <div>
  //             Chain: {chain.name} ({chain.id})
  //           </div>
  //         </div>
  //       ))}

  //       <button type="button" onClick={execute}>Execute!</button>
  //     </>
  //   );
}
