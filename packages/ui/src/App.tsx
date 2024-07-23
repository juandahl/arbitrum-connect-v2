import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import "./App.css";
import Topbar from "./components/layout/topbar";
import config from "./lib/wagmiConfig";
// import ArbitrumPoc from "./ArbitrumPoc";
import { useState } from "react";
import TermsModal from "./components/layout/TermsModal";
import Transaction from "./components/transaction/transaction";

export default function App() {
  const [showModal, setShowModal] = useState(true);
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          showRecentTransactions
          coolMode
          theme={lightTheme({ borderRadius: "medium" })}
        >
          <div className="flex flex-col w-full grow min-h-screen  bg-[url('@/assets/background.svg')] bg-cover text-primary">
            <Topbar />
            {/* <ArbitrumPoc /> */}
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
