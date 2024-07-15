import { ConnectButton } from "@rainbow-me/rainbowkit";
import cn from "classnames";
import { ConnectButtonProps } from "node_modules/@rainbow-me/rainbowkit/dist/components/ConnectButton/ConnectButton";
import React from "react";

interface IConnectButtonProps extends ConnectButtonProps {
  variant?: "contained" | "outlined";
  size?: "small" | "medium";
}

export default function CustomConnectButton({
  label,
  variant = "contained",
  size = "medium",
}: IConnectButtonProps) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
        
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;
        const BaseButton = ({
          children,
          onClick,
          className,
        }: {
          children: React.ReactNode;
          onClick: React.MouseEventHandler<HTMLButtonElement>;
          className?: string;
        }) => (
          <button
            className={cn(`btn px-6 py-2 rounded-3xl bg-white ${className}`)}
            onClick={onClick}
            type="button"
          >
            {children}
          </button>
        );
        const ConnectButton = ({
          children,
          onClick,
        }: {
          children: React.ReactNode;
          onClick: React.MouseEventHandler<HTMLButtonElement>;
          className?: string;
        }) => (
          <BaseButton
            className={cn({
              "btn-primary": variant === "contained",
              "btn-secondary": variant === "outlined",
            })}
            onClick={onClick}
          >
            {children}
          </BaseButton>
        );
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <ConnectButton onClick={openConnectModal}>
                    {label ? (
                      label
                    ) : (
                      <div className="flex flex-row gap-2">
                        <div>-</div>
                        <div>Connect</div>
                      </div>
                    )}
                  </ConnectButton>
                );
              }
              if (chain.unsupported) {
                return (
                  <BaseButton onClick={openChainModal}>
                    Wrong network
                  </BaseButton>
                );
              }
              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <BaseButton onClick={openAccountModal}>
                    {account.displayName}

                    {size === "medium" && account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </BaseButton>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
