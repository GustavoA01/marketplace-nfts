import type { Wallet } from "@/data/types/wallets";
import { Link } from "@tanstack/react-router";
import { Wallet as WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";
const providers = [
  { value: "walletconnect", label: "WalletConnect", mark: "W" },
  { value: "metamask", label: "MetaMask", mark: "M" },
  { value: "coinbase", label: "Coinbase Wallet", mark: "" },
];
type Props = {
  wallets: Wallet[];
  selectedId?: string;
  connected: boolean;
  disabled: boolean;
  connecting: boolean;
  onSelect: (id: string) => void;
  onConnect: () => void;
  onDisconnect: () => void;
};
export const WalletOptions = ({
  wallets,
  selectedId,
  connected,
  disabled,
  connecting,
  onSelect,
  onConnect,
  onDisconnect,
}: Props) => {
  const selected = wallets.find((entry) => entry.id === selectedId);
  return (
    <section className="space-y-4 lg:space-y-5">
      <h2 className="text-base leading-4 font-bold lg:text-center lg:text-[17px]">
        Carteira e rede
      </h2>
      {!wallets.length && (
        <p className="text-sm text-text-secondary">
          Cadastre uma carteira para continuar.{" "}
          <Link to="/carteiras" className="text-primary underline">
            Gerenciar carteiras
          </Link>
        </p>
      )}
      <div className="space-y-4">
        {providers.map((provider) => {
          const match =
            wallets.find(
              (entry) =>
                entry.walletType === provider.value &&
                entry.network === selected?.network,
            ) ?? wallets.find((entry) => entry.walletType === provider.value);
          return (
            <Label
              key={provider.value}
              htmlFor={`checkout-provider-${provider.value}`}
              className={cn(
                "flex min-h-16.25 items-center gap-3 rounded-3xl bg-surface-card px-3.5 py-3 text-sm font-normal lg:min-h-11.25 lg:rounded-[3px] lg:border lg:border-border lg:bg-transparent lg:px-3 lg:py-2",
                selected?.walletType === provider.value && "lg:border-primary",
                !match && "opacity-50",
              )}
              title={
                !match
                  ? "Cadastre uma carteira deste tipo para selecionar."
                  : undefined
              }
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-raised text-primary lg:hidden">
                {provider.mark || <WalletIcon className="size-6" />}
              </span>
              <span className="flex-1 lg:order-2">
                {provider.value === "walletconnect" ? (
                  <>
                    <span className="lg:hidden">{provider.label}</span>
                    <span className="hidden rounded-md border border-border-soft bg-surface-dark px-2 py-1 text-[9px] font-bold text-text-accent lg:inline">
                      METAMASK · WALLETCONNECT · COINBASE
                    </span>
                  </>
                ) : (
                  provider.label
                )}
              </span>
              <Input
                id={`checkout-provider-${provider.value}`}
                type="radio"
                name="checkout-provider"
                checked={selected?.walletType === provider.value}
                disabled={disabled || !match}
                onChange={() => {
                  if (match) onSelect(match.id);
                }}
                className="size-4 shrink-0 accent-primary lg:order-1"
              />
            </Label>
          );
        })}
      </div>
      {selectedId && (
        <Button
          type="button"
          variant="outline"
          disabled={disabled || connecting}
          onClick={connected ? onDisconnect : onConnect}
          className="h-10 w-full rounded-sm text-sm"
        >
          {connecting
            ? "Aguarde..."
            : connected
              ? "Desconectar carteira"
              : "Conectar carteira"}
        </Button>
      )}
      <p role="status" className="text-xs text-text-secondary">
        {connected
          ? "Carteira conectada."
          : "Conecte a carteira selecionada para confirmar."}
      </p>
    </section>
  );
};
