import useArbitrumBridge from "@/hooks/useArbitrum";
import { useEffect, useState } from "react";
import TermsModal from "../layout/terms-modal";
import TransactionResultCard from "./result";
import TransactionsActivity from "./activity";
import TransactionAmount from "./amount";
import TransactionReview from "./review";

enum STEPS {
  menu,
  list,
  amount,
  review,
  result,
}

export interface Transaction {
  bridgeHash: string;
  delayedInboxHash: string;
  amount: string;
}

export default function Transaction() {
  const [currentStep, setCurrentStep] = useState(STEPS.menu);
  const [amount, setAmount] = useState<number>(0);
  const [showModal, setShowModal] = useState(true);
  const [txHistory, setTxHistory] = useState<Transaction[]>([]);
  const [currentTx, setCurrentTx] = useState<Transaction | null>();
  const { initiateWithdraw } = useArbitrumBridge();

  const onReviewSubmit = async () => {
    initiateWithdraw(1)
      .then((x) => {
        console.log("Transaction hashes: ", x);

        const tx: Transaction = {
          bridgeHash: x.l2Txhash,
          delayedInboxHash: x.l1Txhash,
          amount: String(amount), // TODO: temporary until we get amount in wei from input
        };

        localStorage.setItem(
          "transactions",
          JSON.stringify([...txHistory, tx])
        );

        setCurrentTx(tx);
        setCurrentStep(STEPS.result);
      })
      .catch((e) => {
        console.error(e);
        window.alert("Something went wrong, please try again");
      });
  };

  useEffect(() => {
    setTxHistory(JSON.parse(localStorage.getItem("transactions") ?? "[]"));
  }, []);

  return (
    <div className="py-10 px-4">
      {currentStep === STEPS.menu && (
        <div className="flex gap-2 justify-center">
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
          txHistory={txHistory}
          setCurrentTx={(tx) => {
            setCurrentTx(tx)
            setCurrentStep(STEPS.result);
          }}
          onBack={() => setCurrentStep(STEPS.menu)}
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
        <TransactionResultCard
          tx={currentTx!}
          onGoHome={() => setCurrentStep(STEPS.menu)}
          onGoToActivity={() => setCurrentStep(STEPS.list)}
        />
      )}
      <TermsModal isOpen={showModal} onSubmit={() => setShowModal(false)} />
    </div>
  );
}
