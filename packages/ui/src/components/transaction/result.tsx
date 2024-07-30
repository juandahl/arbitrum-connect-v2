import BellIcon from "@/assets/bell.svg";
import CheckGreenIcon from "@/assets/check-green.svg";
import StepOneIcon from "@/assets/step-one.svg";
import StepThreeIcon from "@/assets/step-three.svg";
import StepTwoIcon from "@/assets/step-two.svg";
import cn from "classnames";
import { useBlock, useTransactionReceipt } from "wagmi";

export default function TransactionResultCard({
  amount,
  txHash,
  onSubmit,
}: {
  amount?: number;
  txHash: string;
  onSubmit(): void;
}) {
  const onReturnClick = () => {
    onSubmit();
  };
  const onActivityClick = () => {
    onSubmit();
  };
  const txRecipt = useTransactionReceipt({
    hash: `0x${txHash}`,
  });
  const block = useBlock({ blockNumber: txRecipt.data?.blockNumber });
  const blockTimestamp = Number(block.data?.timestamp) * 1000;
  const elapsedHours = Math.floor(
    (new Date().valueOf() - blockTimestamp) / 1000 / 60 / 60
  );

  return (
    <div
      style={{
        width: "37.5rem",
        gap: 24,
      }}
      className="flex flex-col"
    >
      <div className="flex flex-col items-center">
        <img src={CheckGreenIcon} />
        <div className="text-4xl font-semibold mb-6">Hey! Great Job!</div>
        <div className="text-xl">
          Your withdrawal request for <b className="font-semibold">{amount}</b>{" "}
          ARB from <b className="font-semibold">Arbitrum</b> to{" "}
          <b className="font-semibold">Ethereum</b> has been successfully
          initiated
        </div>
        <div className="text-xl">
          Your transactionHash is: <b>{txHash}</b>
        </div>
        {!Number.isNaN(elapsedHours) && (
          <div className="text-xl">
            Elapsed Time: <b>{elapsedHours}/24h</b>
          </div>
        )}
      </div>
      <div className="h-[17.625rem] flex flex-col text-start justify-between bg-gray-100 border border-neutral-200 rounded-2xl overflow-hidden">
        <div className="flex flex-col grow justify-between p-6 mb-3">
          <div className="flex gap-3">
            <img src={StepOneIcon} />
            <div className="text-lg">Initiate Withdraw</div>
          </div>
          <div className="flex gap-3">
            <img src={StepTwoIcon} />
            <div className="text-lg">Waiting Period</div>
          </div>
          <div className="flex gap-3">
            <img src={StepThreeIcon} />
            <div className="text-lg">Claim funds on Ethereum</div>
          </div>
        </div>
        <div className="bg-gray-200 px-4 py-3">
          <div className="text-sm">
            Have questions about this process?{" "}
            <a className="link">Learn More</a>
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
        onClick={onActivityClick}
      >
        <img src={BellIcon} />
        Go to my activity
      </button>
      <button
        type="button"
        className={cn("btn btn-secondary", {
          "btn-disabled": false,
        })}
        style={{
          border: "1px solid black",
          borderRadius: 16,
        }}
        onClick={onReturnClick}
      >
        Return home
      </button>
    </div>
  );
}
