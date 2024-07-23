import { ethers, Signer } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";

export default function useUserWallet() {
  const [isLoading, setIsLoading] = useState(true);
  const [signer, setSigner] = useState<Signer | null>(null);

  const { data: wallet, isLoading: isWalletLoading } = useWalletClient();

  const { address, chain, isConnected, isConnecting, isReconnecting } =
    useAccount();

  const provider = useMemo(
    () =>
      !isConnected || !wallet
        ? null
        : new ethers.providers.Web3Provider(wallet.transport),
    [isConnected, wallet]
  );

  useEffect(() => {
    if (!provider) {
      setSigner(null);
      return;
    }

    const action = async () => {
      setIsLoading(true);

      const result = provider.getSigner();

      setSigner(result);

      setIsLoading(false);
    };

    action();
  }, [provider]);

  return [
    signer,
    chain,
    isLoading || isWalletLoading || isConnecting || isReconnecting,
    address,
  ] as const;
}
