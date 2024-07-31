import ClockIcon from "@/assets/clock.svg";
import ExternalLinkIcon from "@/assets/external-link.svg";
import cn from "classnames";
import { CheckIcon } from "lucide-react";
export default function TransactionStatus({ txHash }: { txHash: string }) {
  return (
    <div className="h-[17.625rem] flex flex-col text-start justify-between bg-gray-100 border border-neutral-200 rounded-2xl overflow-hidden">
      <div className="flex flex-col grow justify-between p-6 mb-3">
        <div className="text-xs">{`0x${txHash}`}</div>
        <Step
          number={1}
          title="Initiate Withdraw"
          onClick={() => null}
          done
          showOnDone={
            <div className="flex gap-1.5">
              <div>View on Explorer</div>
              <img src={ExternalLinkIcon} />
            </div>
          }
        />
        <Step
          number={2}
          title="Waiting Period"
          onClick={() => null}
          disabled
          showOnPending={
            <>
              <img src={ClockIcon} />
              <div>n hours remaining</div>
            </>
          }
        />
        <Step
          number={3}
          title="Force transaction"
          onClick={() => null}
          disabled
        />
        <Step
          number={4}
          title="Claim funds on Ethereum"
          onClick={() => null}
          disabled
          showOnPending={
            <button onClick={() => null} className="btn btn-primary btn-sm">
              Claim Funds
            </button>
          }
        />
      </div>
      <div className="bg-gray-200 px-4 py-3">
        <div className="text-sm">
          Have questions about this process? <a className="link">Learn More</a>
        </div>
      </div>
    </div>
  );
}

function Step(props: {
  number: number;
  title: string;
  onClick?: () => void;
  action?: string;
  disabled?: boolean;
  done?: boolean;
  showOnPending?: JSX.Element;
  showOnDone?: JSX.Element;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex space-x-3 items-center">
        {props.done ? (
          <div className="h-5 w-5 flex justify-center items-center rounded-full bg-green-500">
            <CheckIcon className="h-4 w-4 text-white" />
          </div>
        ) : (
          <div className="h-5 w-5 flex justify-center items-center rounded-full border-2 border-gray-800">
            <span className="text-xs">{props.number}</span>
          </div>
        )}
        <div className={cn("text-lg", props.done && "text-green-500")}>
          {props.title}
        </div>
      </div>

      {props.disabled
        ? null
        : props.done
          ? props.showOnDone
          : props.showOnPending}
    </div>
  );
}
