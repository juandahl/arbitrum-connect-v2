import EthereumIconCheck from "@/assets/ethereum-icon-check.svg";
import EthereumIcon from "@/assets/ethereum-icon.svg";
import { TransactionStatus } from "@/components/transaction/status";
import { ClaimStatus } from "@/hooks/useArbitrumBridge";
import { Transaction, transactionsStorageService } from "@/lib/transactions";
import { createFileRoute } from "@tanstack/react-router";
import { formatEther } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const Route = createFileRoute("/activity/")({
  component: ActivityScreen,
});

function ActivityScreen() {
  const { address } = useAccount();
  const [txHistory, setTxHistory] = useState<Transaction[]>([]);

  useEffect(() => {
    const txs = address ? transactionsStorageService.getByAccount(address) : [];
    setTxHistory(txs);
  }, [address]);

  return (
    <div className="flex flex-col max-w-xl mx-auto">
      <div className="flex space-x-3 items-center mb-8">
        <h1 className="text-xl text-primary font-semibold">My activity</h1>
      </div>
      <div className="overflow-y-auto bg-neutral-50 h-[66vh]">
        <div className="join join-vertical flex flex-col text-left justify-between items-center border border-neutral-200 rounded-2xl">
          {txHistory.map((x, i) => (
            <div
              className="collapse collapse-arrow join-item"
              key={`collapsable-${i}`}
            >
              <input type="radio" name="accordion" />
              <div className="collapse-title flex justify-center items-center justify-between text-lg h-10 pl-6 p-0 mt-5 mb-2.5 pr-12">
                <div className="flex gap-3 items-center">
                  {x.claimStatus === ClaimStatus.CLAIMED ?
                    <img src={EthereumIconCheck} /> :
                    <img src={EthereumIcon} />}
                  <div className="sm:block overflow-hidden text-ellipsis">Withdrawal</div>
                </div>
                <div>{formatEther(BigInt(x.amount)).slice(0, 6)} ETH</div>
              </div>
              <div className="collapse-content">
                <TransactionStatus tx={x} isActive={false} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
