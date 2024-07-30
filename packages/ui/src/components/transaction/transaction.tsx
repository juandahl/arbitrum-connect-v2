import useArbitrumBridge from "@/hooks/useArbitrum";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import LocalStorageService from "@/lib/localStorageService";
import { useEffect, useState } from "react";
import TermsModal from "../layout/TermsModal";
import TransactionAmountCard from "./amount";
import TransactionResultCard from "./result";
import TransactionReviewCard from "./review";
import { useSwitchChain } from "wagmi";

enum STEPS {
  menu,
  list,
  amount,
  review,
  result,
}

export default function Transaction() {
  const [currentStep, setCurrentStep] = useState(STEPS.menu);
  const [amount, setAmount] = useState<number>(0);
  const [showModal, setShowModal] = useState(true);
  const [txHistory, setTxHistory] = useState<string[]>(["0x123"]);
  const [currentTx, setCurrentTx] = useState<string>("0x123");
  const { initiateWithdraw } = useArbitrumBridge();
  const signer = useEthersSigner();
  // const [l2Tx, setL2Tx] = useState("");
  const { switchChainAsync } = useSwitchChain();

  const onReviewSubmit = async () => {
    // await switchChainAsync({ chainId: 11155111 })
    // await switchChainAsync({ chainId: 421614 });
    // console.log("ok");
    // await signer?.sendTransaction({
    //   to: "0x44cdA3f339444F2FD5C34783c0d0d487E5Dc0f27",
    //   value: 0,
    // });

    initiateWithdraw(1).then(console.log);

    // const tx = {
    //   to: "0x44cdA3f339444F2FD5C34783c0d0d487E5Dc0f27",
    //   value: 0,
    // };
    // signer?.populateTransaction(tx).then((populatedTx) => {
    //   signer.signTransaction(populatedTx)
    // })

    // window.ethereum
    //   .request({
    //     method: "eth_signTransaction",
    //     params: [
    //       {
    //         to: "0x44cdA3f339444F2FD5C34783c0d0d487E5Dc0f27",
    //         value: 0,
    //       },
    //     ],
    //   })
    //   .then((signedTx: any) => {
    //     console.log("Signed transaction:", signedTx);
    //   });

    // initiateWithdraw(1).then((x) => {
    //   console.log("Transaction hash: ", x);
    //   if (!x?.l2Txhash) {
    //     console.log("Something went wrong, we couldn't get l2tx hash");
    //     return;
    //   }

    //   new LocalStorageService().setItem(
    //     "transactions",
    //     JSON.stringify([...txHistory, x.l2Txhash])
    //   );

    //   setCurrentTx(x.l2Txhash);
    //   setCurrentStep(STEPS.result);
    // }).catch(e => {
    //   console.error(e);
    // })
  };

  // const onSendToDelayedInbox = () => {
  //   sendToDelayedInbox(l2Tx)
  //     .then(console.log)
  //     .then(() => {
  //       new LocalStorageService().setItem(
  //         "transactions",
  //         JSON.stringify([...txHistory, l2Tx])
  //       );

  //       // setCurrentTx(l2Tx);
  //       setCurrentStep(STEPS.result);
  //     });
  // };

  useEffect(() => {
    setTxHistory(
      JSON.parse(new LocalStorageService().getItem("transactions")) ?? []
    );
  }, []);

  return (
    <div className="flex flex-col items-center grow justify-center">
      {currentStep === STEPS.menu && (
        <div className="flex gap-2">
          <button className="btn" onClick={() => setCurrentStep(STEPS.amount)}>
            New Tx
          </button>
          <button className="btn" onClick={() => setCurrentStep(STEPS.list)}>
            Last Txs
          </button>
        </div>
      )}
      {currentStep === STEPS.list && (
        <div>
          <button className="btn" onClick={() => setCurrentStep(STEPS.menu)}>
            Go back
          </button>
          {txHistory.map((x) => (
            <div>
              {x}{" "}
              <button
                onClick={() => {
                  setCurrentTx(x);
                  setCurrentStep(STEPS.result);
                }}
              >
                view detail
              </button>
            </div>
          ))}
        </div>
      )}
      {currentStep === STEPS.amount && (
        <TransactionAmountCard
          amount={amount}
          onBack={() => {
            setCurrentStep(STEPS.menu);
          }}
          onSubmit={(amount) => {
            setAmount(amount);
            setCurrentStep(STEPS.review);
          }}
        />
      )}
      {currentStep === STEPS.review && (
        <TransactionReviewCard
          amount={amount}
          onBack={() => {
            setCurrentStep(STEPS.amount);
          }}
          onSubmit={async () => {
            onReviewSubmit();
            // if (l2Tx) onSendToDelayedInbox()
            // else onReviewSubmit()
          }}
        />
      )}
      {currentStep === STEPS.result && (
        <TransactionResultCard
          amount={amount}
          txHash={currentTx}
          onSubmit={() => {
            setCurrentStep(STEPS.menu);
          }}
        />
      )}
      <TermsModal isOpen={showModal} onSubmit={() => setShowModal(false)} />
    </div>
  );
}
