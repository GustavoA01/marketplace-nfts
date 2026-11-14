import { MoreVertical, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import type { CollectorWalletPreview } from "@/data/types/purchase";

type WalletOptionsProps = {
  wallets: CollectorWalletPreview[];
  mobile?: boolean;
};

export const WalletOptions = ({
  wallets,
  mobile = false,
}: WalletOptionsProps) => {
  return (
    <section>
      {mobile && (
        <>
          <div className="mb-4 flex items-center justify-between gap-3 text-base leading-5 font-bold">
            <h2>Carteira conectada</h2>
            <Button type="button" variant="link" className="h-auto p-0 text-sm">
              Trocar carteira
            </Button>
          </div>
          <div className="mb-4 space-y-5">
            {wallets.map((wallet) => (
              <Label
                key={wallet.id}
                htmlFor={`saved-${wallet.id}`}
                className="flex items-center gap-4 rounded-2xl bg-surface-card p-5"
              >
                <Input
                  id={`saved-${wallet.id}`}
                  name="saved-wallet"
                  type="radio"
                  value={wallet.id}
                  defaultChecked={wallet.selected}
                  className="size-4 shrink-0 accent-primary"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold">
                    {wallet.name}
                  </span>
                  <span className="mt-1 block break-all text-sm leading-[22px] font-normal text-text-secondary">
                    {wallet.address}
                    <br />
                    {wallet.network}
                  </span>
                </span>
                <MoreVertical className="size-5 shrink-0 text-secondary" />
              </Label>
            ))}
          </div>
        </>
      )}
      <h2 className="mb-4 text-base leading-5 font-bold lg:text-center">
        Carteira e rede
      </h2>
      <div className="space-y-4">
        {[
          { id: "walletconnect", name: "WalletConnect", symbol: "W" },
          { id: "metamask", name: "MetaMask", symbol: "M" },
          { id: "coinbase", name: "Coinbase Wallet", symbol: "" },
        ].map((option) => (
          <Label
            key={option.id}
            htmlFor={`${mobile ? "mobile" : "desktop"}-provider-${option.id}`}
            className="flex min-h-[65px] items-center gap-3 rounded-2xl bg-surface-card p-4 text-sm font-normal lg:min-h-[45px] lg:flex-row-reverse lg:rounded-sm lg:border lg:border-border has-checked:border-primary lg:bg-transparent lg:p-3"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-raised font-bold text-primary lg:hidden">
              {option.symbol || <Wallet className="size-5" />}
            </span>
            <span className="min-w-0 flex-1">{option.name}</span>
            <Input
              id={`${mobile ? "mobile" : "desktop"}-provider-${option.id}`}
              type="radio"
              name={`${mobile ? "mobile" : "desktop"}-provider`}
              value={option.id}
              defaultChecked={option.id === "coinbase"}
              className="size-4 shrink-0 accent-primary"
            />
          </Label>
        ))}
      </div>
    </section>
  );
};
