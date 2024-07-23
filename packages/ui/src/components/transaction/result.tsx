import cn from "classnames";

export default function TransactionResultCard({
  onSubmit,
}: {
  onSubmit(): void;
}) {
  const onReturnClick = () => {
    onSubmit();
  };
  const onActivityClick = () => {
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
      <div>
        <div>icon OK</div>
        <div>Hey! Great Job!</div>
        <div>
          Your withdrawal request for 0.0005 ETH from Arbitrum to Ethereum has
          been successfully initiated
        </div>
      </div>
      <div
        className="flex flex-col text-start bg-gray-100"
        style={{
          overflow: "hidden",
          justifyContent: "space-between",
          border: "1px solid #E5E7EB",
          borderRadius: 16,
        }}
      >
        <div className="p-1">
          <div className="">Initiate Withdraw</div>
          <div className="">Waiting Period</div>
          <div className="">Claim funds on Ethereum</div>
        </div>
        <div className="bg-gray-200">
          <div className="p-1">
            Have questions about this process? <a>Learn More</a>
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
