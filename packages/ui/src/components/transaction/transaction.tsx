import useArbitrumBridge from "@/hooks/useArbitrum";
import LocalStorageService from "@/lib/localStorageService";
import { useEffect, useState } from "react";
import TermsModal from "../layout/TermsModal";
import TransactionAmountCard from "./amount";
import TransactionResultCard from "./result";
import TransactionReviewCard from "./review";

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
  const [txHistory, setTxHistory] = useState<string[]>([]);
  const [currentTx, setCurrentTx] = useState<string>();
  const { initiateWithdraw } = useArbitrumBridge();

  const onReviewSubmit = async () => {
    initiateWithdraw(amount)
      .then((x) => {
        console.log("Transaction hashes: ", x);

        if (!x?.l2Txhash) {
          window.alert("Something went wrong, we couldn't get l2tx hash");
          return;
        }

        new LocalStorageService().setItem(
          "transactions",
          JSON.stringify([...txHistory, x.l2Txhash])
        );

        setCurrentTx(x.l2Txhash);
        setCurrentStep(STEPS.result);
      })
      .catch((e) => {
        console.error(e);
      });
  };

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
          onSubmit={onReviewSubmit}
        />
      )}
      {currentStep === STEPS.result && (
        <TransactionResultCard
          amount={amount}
          txHash={currentTx ?? ""}
          onSubmit={() => {
            setCurrentStep(STEPS.menu);
          }}
        />
      )}
      <TermsModal isOpen={showModal} onSubmit={() => setShowModal(false)} />
    </div>
  );
}
