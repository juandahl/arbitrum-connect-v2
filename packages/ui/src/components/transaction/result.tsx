import BellIcon from "@/assets/bell.svg";
import CheckGreenIcon from "@/assets/check-green.svg";
import cn from "classnames";
import { useBlock, useTransactionReceipt } from "wagmi";
import TransactionStatus from "./status";

export default function TransactionResult({
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
  console.log("txRecipt: ", txRecipt.data);
  const block = useBlock({ blockNumber: txRecipt.data?.blockNumber });
  const blockTimestamp = Number(block.data?.timestamp) * 1000;
  const elapsedHours = Math.floor(
    (new Date().valueOf() - blockTimestamp) / 1000 / 60 / 60
  );

  return (
    <div className="flex flex-col w-[37.5rem] gap-6">
      <div className="flex flex-col items-center">
        <img src={CheckGreenIcon} />
        <div className="text-4xl font-semibold mb-6">Hey! Great Job!</div>
        <div className="text-xl">
          Your withdrawal request for <b className="font-semibold">{amount}</b>{" "}
          ETH from <b className="font-semibold">Arbitrum</b> to{" "}
          <b className="font-semibold">Ethereum</b> has been successfully
          initiated
        </div>
        <div className="text-xl">
          Your transactionHash is: <b>{`0x${txHash}`}</b>
        </div>
        {!Number.isNaN(elapsedHours) && (
          <div className="text-xl">
            Elapsed Time: <b>{elapsedHours}/24h</b>
          </div>
        )}
      </div>

      {/* Steps */}
      <TransactionStatus txHash={txHash} />

      <button
        type="button"
        className={cn("btn btn-primary", { "btn-disabled": false })}
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
