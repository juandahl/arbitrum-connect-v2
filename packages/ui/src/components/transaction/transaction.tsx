import useArbitrum from "@/hooks/useArbitrum";
import { useEthersSigner } from "@/hooks/useEthersSigner";
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
  const { initiateWithdraw } = useArbitrum();
  const [showModal, setShowModal] = useState(true);
  const [txHistory, setTxHistory] = useState<string[]>([]);
  const [currentTx, setCurrentTx] = useState<string>("");
  const newSigner = useEthersSigner();
  const onReviewSubmit = () => {
    initiateWithdraw(newSigner!, amount).then((x) => {
      if (!x?.l2Txhash) {
        console.log("Something went wrong, we couldn't get l2tx hash");
        return;
      }
      setCurrentTx(x.l2Txhash);
      new LocalStorageService().setItem(
        "transactions",
        JSON.stringify([...txHistory, x.l2Txhash])
      );
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
          onSubmit={async () => {
            onReviewSubmit();
            setCurrentStep(STEPS.result);
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
