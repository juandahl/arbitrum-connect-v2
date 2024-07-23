import ArbitrumConnectIcon from "@/assets/arbitrum-connect.svg";
import cn from "classnames";
import Modal from "./modal";

export default function TermsModal({
  isOpen,
  onSubmit,
}: {
  isOpen: boolean;
  onSubmit?(): void;
}) {
  return (
    <Modal isOpen={isOpen}>
      <img src={ArbitrumConnectIcon} />
      <div className="text-xl">Welcome to Arbitrum Connect</div>
      <div className="text-xl">
        We ensure your transactions are processed even if the Arbitrum Sequencer
        is down or other unexpected issues arise. Learn more.
      </div>
      <div>
        <div>
          By using Arbitrum Connect, you agree to our Terms and Privacy Policy
          Get started
        </div>
        <button
          type="button"
          className={cn("btn btn-primary", {
            "btn-disabled": false,
          })}
          onClick={onSubmit}
        >
          Get Started
        </button>
      </div>
    </Modal>
  );
}
