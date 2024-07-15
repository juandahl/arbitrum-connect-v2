// import { Link } from "@tanstack/react-router";
import CustomConnectButton from "../styled/connectButton/customConnectButton";

export default function Topbar() {
  return (
    <header className="flex justify-between items-center | sticky top-0 sm:px-8 ml-16 | h-[4rem] card--blur z-10">
      <div className="flex justify-between items-center | w-full">
        <div className="flex items-center font-bold pointer">
          <span>Arbitrum Connect</span>
        </div>

        <CustomConnectButton />
      </div>
    </header>
  );
}
