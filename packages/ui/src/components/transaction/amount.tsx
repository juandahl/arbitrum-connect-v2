import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import CustomConnectButton from "../styled/connectButton/customConnectButton";
import EthereumIcon from "@/assets/ethereum-icon.svg";
import ArbitrumIcon from "@/assets/arbitrum-icon.svg";

export default function TransactionAmountCard({
  onSubmit,
}: {
  onSubmit(amount: number): void;
}) {
  const amount = 5;
  const { openConnectModal } = useConnectModal();

  const { address } = useAccount();
  const onContinueClick = () => {
    if (!address && openConnectModal) {
      openConnectModal();
      return;
    }
    if (!amount) return;
    onSubmit(amount);
  };

  return (
    <div
      style={{
        width: "37.5rem",
        gap: 24,
      }}
      className="flex flex-col"
    >
      <div
        className="flex text-left items-center"
        style={{
          justifyContent: "space-between",
          backgroundColor: "white",
          padding: 24,
          border: "1px solid black",
          borderRadius: 16,
        }}
      >
        <div className="flex flex-row gap-3 items-start">
          <img src={ArbitrumIcon} />
          <div>
            <div className="text-sm">From</div>
            <div className="font-semibold text-2xl">Arbitrum</div>
          </div>
        </div>
        <div>{">"}</div>
        <div className="flex flex-row gap-3 items-start">
          <img src={EthereumIcon} />
          <div>
            <div className="text-sm">To</div>
            <div className="font-semibold text-2xl">Ethereum</div>
          </div>
        </div>
      </div>
      <div
        className="flex flex-col grow justify-between items-center"
        style={{
          height: 336,
          justifyContent: "space-between",
          backgroundColor: "white",
          padding: 24,
          border: "1px solid black",
          borderRadius: 16,
        }}
      >
        <div className="flex flex-col grow items-center justify-center">
          <div className="text-7xl">0</div>
          <div className="text-base">~ 0.00 USD</div>
        </div>
        <hr className="w-full pb-6" />
        <div className="flex justify-between items-center w-full px-6">
          <div className="text-left">
            <div>ETH</div>
            <div>Balance 0</div>
          </div>
          <div className="flex flex-row items-center gap-5">
            <button className="btn btn-secondary">Max</button>
            <div>\/</div>
          </div>
        </div>
      </div>
      <div
        className="flex justify-between items-center flex-col gap-4"
        style={{
          justifyContent: "space-between",
          backgroundColor: "white",
          padding: 24,
          border: "1px solid black",
          borderRadius: 16,
        }}
      >
        <div className="w-full flex justify-between items-center">
          <div className="flex">
            <div>{"-"}</div>
            <div>Address</div>
          </div>
          {/* <button onClick={openConnectModal}>{"..."}</button> */}
          <CustomConnectButton
            variant="outlined"
            size="small"
            accountStatus={"address"}
            showBalance={false}
            chainStatus={"none"}
            label="..."
          />
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="flex">
            <div>{"-"}</div>
            <div>Transfer Time</div>
          </div>
          <div>~ 24 hours</div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="flex">
            <div>{"-"}</div>
            <div>Network fees (Ether Gas)</div>
          </div>
          <div className="flex flex-row gap-6">
            <div>~ $85.57</div>
            <div>0.012 ETH</div>
          </div>
        </div>
      </div>
      <button
        className="btn btn-primary"
        style={{
          border: "1px solid black",
          borderRadius: 16,
        }}
        onClick={onContinueClick}
      >
        {address
          ? amount
            ? "Continue"
            : "Enter an amount"
          : "Connet your wallet to withdraw"}
      </button>
    </div>
  );
}
