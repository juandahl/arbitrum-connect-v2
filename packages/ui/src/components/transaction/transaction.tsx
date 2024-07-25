import { useState } from "react";
import TransactionAmountCard from "./amount";
import TransactionResultCard from "./result";
import TransactionReviewCard from "./review";

enum STEPS {
  amount,
  review,
  result,
}

export default function Transaction() {
  const [currentStep, setCurrentStep] = useState(STEPS.amount);
  return (
    <div className="flex flex-col items-center grow justify-center">
      {currentStep === STEPS.amount && (
        <TransactionAmountCard
          onSubmit={() => {
            console.log("bam");
            setCurrentStep(STEPS.review);
          }}
        />
      )}
      {currentStep === STEPS.review && (
        <TransactionReviewCard
          onSubmit={() => {
            setCurrentStep(STEPS.result);
          }}
        />
      )}
      {currentStep === STEPS.result && (
        <TransactionResultCard
          onSubmit={() => {
            setCurrentStep(STEPS.amount);
          }}
        />
      )}
    </div>
  );
}
