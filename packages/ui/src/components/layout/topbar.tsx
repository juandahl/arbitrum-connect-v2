import ArbitrumConnectIcon from "@/assets/arbitrum-connect.svg";
import CustomConnectButton from "@/components/styled/connectButton/customConnectButton";

export default function Topbar() {
  return (
    <header className="flex justify-between items-center | sticky top-0 sm:px-8 | h-[4rem] card--blur z-10 bg-white px-4">
      <div className="flex justify-between items-center | w-full">
        <div className="flex items-center gap-3">
          <img src={ArbitrumConnectIcon} width={32} height={32} />
          <span className="text-2xl">
            <b>Arbitrum</b> Connect
          </span>
        </div>
        <CustomConnectButton border="square" />
      </div>
    </header>
  );
}
