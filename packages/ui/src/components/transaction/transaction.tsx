import useArbitrum from "@/hooks/useArbitrum";
import useUserWallet from "@/hooks/useUserWallet";
import LocalStorageService from "@/lib/localStorageService";
import { ContractTransaction } from "ethers";
import { useEffect, useState } from "react";
import TermsModal from "../layout/TermsModal";
import TransactionAmountCard from "./amount";
import TransactionResultCard from "./result";
import TransactionReviewCard from "./review";

enum STEPS {
  menu,
  amount,
  review,
  result,
}

export default function Transaction() {
  const [l1Signer, chain] = useUserWallet();
  const [currentStep, setCurrentStep] = useState(STEPS.menu);
  const [amount, setAmount] = useState<number>(0);
  const [l2Tx, setL2Tx] = useState<ContractTransaction>();
  const { submitL2Tx } = useArbitrum();
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (l2Tx) new LocalStorageService().setItem("lastTxHash", l2Tx.hash);
  }, [l2Tx]);
  return (
    <div className="flex flex-col items-center grow justify-center">
      {currentStep === STEPS.menu && (
        <div className="flex gap-2">
          <button className="btn" onClick={() => setCurrentStep(STEPS.amount)}>
            Nueva transacción
          </button>
          <button className="btn" onClick={() => setCurrentStep(STEPS.result)}>
            Ver última transacción
          </button>
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
            l1Signer &&
              chain &&
              amount &&
              setL2Tx(await submitL2Tx(l1Signer, chain, { value: amount }));
            setCurrentStep(STEPS.result);
          }}
        />
      )}
      {currentStep === STEPS.result && (
        <TransactionResultCard
          amount={amount}
          tx={l2Tx}
          onSubmit={() => {
            setCurrentStep(STEPS.menu);
          }}
        />
      )}
      <TermsModal isOpen={showModal} onSubmit={() => setShowModal(false)} />
    </div>
  );
}
