import { useState } from "react";
import "./App.css";
import Topbar from "./components/layout/topbar";
import TermsModal from "./components/layout/TermsModal";
import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { createConfig, http, WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Transaction from "./components/transaction/transaction";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";

export default function App() {
  const [showModal, setShowModal] = useState(true);
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider showRecentTransactions coolMode theme={lightTheme({borderRadius:"medium"})}>
          <div className="flex flex-col w-full grow min-h-screen  bg-[url('@/assets/background.svg')] bg-cover">
            <Topbar />
            <Transaction />
            <TermsModal
              isOpen={showModal}
              onSubmit={() => setShowModal(false)}
            />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: connectorsForWallets(
    [
      {
        groupName: "My Wallets",
        wallets: [metaMaskWallet],
      },
    ],
    {
      appName: "Arbitrum PoC",
      projectId: "ARBITRUM_POC",
    }
  ),
  ssr: false,
});
