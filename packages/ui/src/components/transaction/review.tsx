import cn from "classnames";
export default function TransactionReviewCard({
  onSubmit,
}: {
  onSubmit(): void;
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
      <div className="flex items-center flex-row">
        <div>{"<"}</div>
        <div>Review and confirm</div>
      </div>
      <div
        className="flex"
        style={{
          justifyContent: "space-between",
          backgroundColor: "white",
          padding: 24,
          border: "1px solid black",
          borderRadius: 16,
        }}
      >
        <div style={{ gap: 12 }} className="flex items-center flex-row">
          <div>-</div>
          <div style={{ gap: 2 }} className="flex items-center flex-row">
            <div>0.00005</div>
            <div>ETH</div>
          </div>
        </div>
        <div>
          <div>~ $1.684 USD</div>
        </div>
      </div>
      <div
        className="flex grow justify-between items-center flex-col"
        style={{
          height: 336,
          justifyContent: "space-between",
          backgroundColor: "white",
          padding: 24,
          border: "1px solid black",
          borderRadius: 16,
        }}
      >
        <div
          style={{
            backgroundColor: "#C2DCFF",
            padding: 24,
            border: "1px solid black",
            borderRadius: 16,
          }}
          className="text-sm"
        >
          You are about to withdraw funds from Arbitrum to Ethereum. This
          process requires 2 transactions and gas fees in ETH. Any doubts? Learn
          More
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="flex">
            <div>{"[]"}</div>
            <div>Initiate Withdraw</div>
          </div>
          <div className="flex items-center flex-row">
            <div>0.012 ETH</div>
            <div>~ $85.57</div>
          </div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="flex">
            <div>{"[]"}</div>
            <div>Waiting Period</div>
          </div>
          <div>~ 24 hours</div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="flex">
            <div>{"[]"}</div>
            <div>Claim funds on Ethereum</div>
          </div>
          <div className="flex items-center flex-row">
            <div>0.026 ETH</div>
            <div>~ $192.63</div>
          </div>
        </div>
      </div>
      <div
        className="flex justify-between flex-col"
        style={{
          justifyContent: "space-between",
          backgroundColor: "white",
          padding: 24,
          border: "1px solid black",
          borderRadius: 16,
        }}
      >
        <div className="w-full flex justify-between flex-col text-start">
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
