import localStorageService from "@/lib/localStorageService";
import { useEffect, useState } from "react";

import EthereumIcon from "@/assets/ethereum-icon.svg";
import TransactionStatus from "./status";

export default function TransactionsActivity({
  onTxSelected,
  onBack,
}: {
  amount?: number;
  onTxSelected(txHash: string): void;
  onBack(): void;
}) {
  const [txHistory, setTxHistory] = useState<string[]>([]);

  useEffect(() => {
    const txs = localStorageService.getItem<string[]>("transactions") ?? [];
    setTxHistory(txs);
  }, []);

  return (
    <>
      <div className="flex flex-col w-[37.5rem]">
        <div className="flex justify-self-start text-xl font-semibold mb-8">
          My activity
        </div>
        <div className="flex flex-col w-full gap-6">
          <div className="flex flex-col text-left justify-between items-center border border-neutral-200 rounded-2xl p-5">
            {txHistory.map((x, i) => (
                <div
                  className="collapse collapse-arrow join-item"
                  key={`collapsable-${i}`}
                >
                  <input type="radio" name="accordion" />
                  <div className="collapse-title text-lg flex items-center justify-between after:traslate-y-0">
                    <div className="flex gap-3 items-center">
                      <img src={EthereumIcon} />
                      <div className="">Withdrawal</div>
                    </div>
                    <div className="flex items-center">0.0005 ETH</div>
                  </div>
                  <div className="collapse-content">
                    <TransactionStatus txHash={x} />
                  </div>
                </div>
            ))}
          </div>
        </div>
        <button className="btn" onClick={onBack}>
          Go back
        </button>
      </div>
    </>
  );
}
