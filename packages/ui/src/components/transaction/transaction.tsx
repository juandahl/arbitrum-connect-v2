import useArbitrumBridge from "@/hooks/useArbitrum";
import LocalStorageService from "@/lib/localStorageService";
import { useState } from "react";
import TermsModal from "../layout/TermsModal";
import TransactionsActivity from "./activity";
import TransactionAmount from "./amount";
import TransactionResult from "./result";
import TransactionReview from "./review";

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
        const txHistory =
          LocalStorageService.getItem<string[]>("transactions") ?? [];
        LocalStorageService.setItem("transactions", [...txHistory, x.l2Txhash]);

        setCurrentTx(x.l2Txhash);
        setCurrentStep(STEPS.result);
      })
      .catch((e) => {
        console.error(e);
      });
  };

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
        <TransactionsActivity
          onBack={() => setCurrentStep(STEPS.menu)}
          onTxSelected={setCurrentTx}
        />
      )}
      {currentStep === STEPS.amount && (
        <TransactionAmount
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
        <TransactionReview
          amount={amount}
          onBack={() => {
            setCurrentStep(STEPS.amount);
          }}
          onSubmit={onReviewSubmit}
        />
      )}
      {currentStep === STEPS.result && (
        <TransactionResult
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
