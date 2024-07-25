import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function useArbitrumBalance() {
  const { address } = useAccount();
  const [balanceOnArbitrum, setBalanceOnArbitrum] = useState("");
  useEffect(() => {
    const getBalance = async () => {
      const env = "dev";
      const arbitrumRpcUrl =
        env === "prod"
          ? "https://arb1.arbitrum.io/rpc"
          : "https://sepolia-rollup.arbitrum.io/rpc";
      if (address) {
        const provider = new ethers.providers.JsonRpcProvider(arbitrumRpcUrl);
        const rawBalance = await provider.getBalance(address);
        const balance = ethers.utils.formatEther(rawBalance);

        setBalanceOnArbitrum(balance);
      }
    };

    getBalance();
  }, [address]);
  return balanceOnArbitrum;
}
