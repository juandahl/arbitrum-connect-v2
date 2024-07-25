import ArbitrumIcon from "@/assets/arbitrum-icon.svg";
import ArrowRightIcon from "@/assets/arrow-right.svg";
import ArrowSwapIcon from "@/assets/arrow-swap.svg";
import ChevronDownIcon from "@/assets/chevron-down.svg";
import ClockIcon from "@/assets/clock.svg";
import EthereumIcon from "@/assets/ethereum-icon.svg";
import NoteIcon from "@/assets/note.svg";
import WalletIcon from "@/assets/wallet.svg";
import CustomConnectButton from "@/components/styled/connectButton/customConnectButton";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useRef } from "react";
import { formatUnits } from "viem";
import { useAccount, useBalance } from "wagmi";

export default function TransactionAmountCard({
  onSubmit,
}: {
  onSubmit(amount: number): void;
}) {
  const amount = 5;
  const { openConnectModal } = useConnectModal();
  const usdAmountRef = useRef<HTMLInputElement>(null);
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const onFormSubmit = () => {
    if (!address && openConnectModal) {
      openConnectModal();
      return;
    }
    if (!amount) return;
    onSubmit(amount);
  };
  const onAmountChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!usdAmountRef?.current || isNaN(Number(e.target.value))) return;
    usdAmountRef.current.innerText = `~ ${Number(e.target.value) * 3} USD`;
  };

  return (
    <form onSubmit={onFormSubmit} noValidate>
      <div className="flex flex-col gap-6 w-150">
        <div className="flex text-left justify-between items-center bg-neutral-50 border border-neutral-200 rounded-2xl p-5">
          <div className="flex flex-row gap-3 items-start">
            <img src={ArbitrumIcon} />
            <div>
              <div className="text-sm text-neutral-500">From</div>
              <div className="font-semibold text-2xl">Arbitrum</div>
            </div>
          </div>
          <img src={ArrowRightIcon} />
          <div className="flex flex-row gap-3 items-start">
            <img src={EthereumIcon} />
            <div>
              <div className="text-sm text-neutral-500">To</div>
              <div className="font-semibold text-2xl">Ethereum</div>
            </div>
          </div>
        </div>
        <div
          className="flex flex-col grow justify-between items-center bg-neutral-50 border border-neutral-200 rounded-2xl p-5 pt-0"
          style={{
            height: 336,
          }}
        >
          <div className="flex flex-col grow items-center justify-center text-neutral-400">
            <input
              name="amount"
              type="number"
              placeholder="0"
              className="bg-neutral-50 text-center text-7xl w-full outline-none remove-arrow"
              onChange={onAmountChange}
            />
            <div className="flex gap-1 ml-4">
              <div className="text-base" ref={usdAmountRef}>
                ~ 0 USD
              </div>
              <img src={ArrowSwapIcon} />
            </div>
          </div>
          <hr className="w-full pb-6" />
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-4">
              <img src={EthereumIcon} />
              <div className="flex flex-col text-left">
                <div className="font-bold text-xl">ETH</div>
                <div className="text-neutral-500">
                  Balance{" "}
                  {balance
                    ? formatUnits(
                        BigInt(balance.value),
                        balance?.decimals
                      ).toString()
                    : "0"}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center gap-5">
              <button
                type="button"
                className="btn btn-neutral rounded-3xl px-5"
              >
                Max
              </button>
              <img src={ChevronDownIcon} />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center flex-col gap-4 bg-neutral-50 border border-neutral-200 rounded-2xl p-5">
          <div className="w-full flex justify-between items-center">
            <div className="flex gap-3">
              <img src={WalletIcon} />
              <div>Address</div>
            </div>
            {/* <button type="button" onClick={openConnectModal}>{"..."}</button> */}
            <CustomConnectButton
              variant="outlined"
              size="small"
              accountStatus={"address"}
              showBalance={false}
              chainStatus={"none"}
              label="..."
            />
          </div>
          <div className="w-full flex justify-between items-center h-9">
            <div className="flex gap-3">
              <img src={ClockIcon} />
              <div>Transfer Time</div>
            </div>
            <div>~ 24 hours</div>
          </div>
          <div className="w-full flex justify-between items-center h-9">
            <div className="flex gap-3">
              <img src={NoteIcon} />
              <div>Network fees (Ether Gas)</div>
            </div>
            <div className="flex flex-row gap-6">
              <div className="text-neutral-400">~ $85.57</div>
              <div>0.012 ETH</div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary rounded-3xl border-current"
        >
          {address
            ? amount
              ? "Continue"
              : "Enter an amount"
            : "Connet your wallet to withdraw"}
        </button>
      </div>
    </form>
  );
}
