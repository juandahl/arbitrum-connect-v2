import useArbitrumBridge from "@/hooks/useArbitrum";
import { useEffect, useState } from "react";
import TermsModal from "../layout/terms-modal";
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
        <div className="max-w-xl text-left w-full space-y-8">
          <button className="btn" onClick={() => setCurrentStep(STEPS.menu)}>
            Go back
          </button>
          <ul>
            {txHistory.map((x) => (
              <li key={x.bridgeHash} className="list-disc ml-4">
                {x.bridgeHash}{" "}
                <button
                  className="link"
                  onClick={() => {
                    setCurrentTx(x);
                    setCurrentStep(STEPS.result);
                  }}
                >
                  View detail
                </button>
              </li>
            ))}
          </ul>
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
          tx={currentTx!}
          onGoHome={() => setCurrentStep(STEPS.menu)}
          onGoToActivity={() => setCurrentStep(STEPS.list)}
        />
      )}
      <TermsModal isOpen={showModal} onSubmit={() => setShowModal(false)} />
    </div>
  );
}
