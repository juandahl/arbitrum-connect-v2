import ChevronLeftIcon from "@/assets/chevron-left.svg";
import EthIcon from "@/assets/ethereum-icon.svg";
import StepOneIcon from "@/assets/step-one.svg";
import StepThreeIcon from "@/assets/step-three.svg";
import StepTwoIcon from "@/assets/step-two.svg";
import cn from "classnames";

export default function TransactionReviewCard({
  amount,
  onSubmit,
  onBack,
}: {
  amount?: number;
  onSubmit(): void;
  onBack(): void;
}) {
  const canSubmit = true;
  const onContinueClick = () => {
    onSubmit();
  };

  return (
    <div
      style={{
        width: "37.5rem",
        gap: 24,
      }}
      className="flex flex-col"
    >
      <button className="flex items-center flex-row gap-3" onClick={onBack}>
        <img src={ChevronLeftIcon} />
        <div className="font-semibold text-xl">Review and confirm</div>
      </button>
      <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 rounded-2xl p-6">
        <div className="flex items-center flex-row gap-3">
          <img src={EthIcon} />
          <div className="flex items-end flex-row ">
            <div className="text-4xl font-bold">{`${amount}`}</div>
            <div className="ml-0.5 text-lg font-bold">ETH</div>
          </div>
        </div>
        <div className="text-neutral-400">~ - USD</div>
      </div>
      <div className="flex grow justify-between items-center flex-col bg-neutral-50 border border-neutral-200 rounded-2xl p-6 gap-6">
        <div className="bg-[#C2DCFF] p-6 text-sm rounded-2xl p-4">
          You are about to withdraw funds from Arbitrum to Ethereum. This
          process requires 2 transactions and gas fees in ETH. Any doubts?{" "}
          <a href="#" className="link">
            Learn More
          </a>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-3">
            <img src={StepOneIcon} />
            <div>Initiate Withdraw</div>
          </div>
          <div className="flex items-center flex-row gap-3">
            <div>0.012 ETH</div>
            <div className="text-neutral-400">~ $-</div>
          </div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-3">
            <img src={StepTwoIcon} />
            <div>Waiting Period</div>
          </div>
          <div>~ 24 hours</div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-3">
            <img src={StepThreeIcon} />
            <div>Claim funds on Ethereum</div>
          </div>
          <div className="flex items-center flex-row gap-3">
            <div>0.026 ETH</div>
            <div className="text-neutral-400">~ $-</div>
          </div>
        </div>
      </div>
      <div className="flex grow justify-between flex-col text-start bg-neutral-50 border border-neutral-200 rounded-2xl p-6 gap-6">
        <div className="flex gap-6">
          <input type="checkbox" />
          <div>
            I understand the entire process will take approximately 24 hours
            before I can claim my funds on Ethereum.
          </div>
        </div>
        <div className="flex gap-6">
          <input type="checkbox" />
          <div>
            I understand that once the transaction is initiated, if the
            Sequencer becomes operational again the process can be completed
            before that 24-hour period.
          </div>
        </div>
        <div className="flex gap-6">
          <input type="checkbox" />
          <div>
            I understand that times and network fees are approximate and may
            change.
          </div>
        </div>
      </div>
      <button
        type="button"
        className={cn("btn btn-primary", {
          "btn-disabled": false,
        })}
        style={{
          border: "1px solid black",
          borderRadius: 16,
        }}
        disabled={!canSubmit}
        onClick={onContinueClick}
      >
        Confirm Withdrawal
      </button>
    </div>
  );
}
