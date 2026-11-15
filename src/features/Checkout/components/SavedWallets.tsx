import type { Wallet } from "@/data/types/wallets";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

type SavedWalletsProps = {
  wallets: Wallet[];
  selectedId?: string;
  idPrefix?: string;
  disabled: boolean;
  onSelect: (id: string) => void;
};

export const SavedWallets = ({
  wallets,
  selectedId,
  idPrefix = "checkout-saved",
  disabled,
  onSelect,
}: SavedWalletsProps) => (
  <div className="space-y-5">
    {wallets.map((wallet) => (
      <div
        key={wallet.id}
        className="flex min-h-23.25 items-center gap-4 rounded-2xl bg-surface-card px-5 py-3"
      >
        <Label
          htmlFor={`${idPrefix}-${wallet.id}`}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-4"
        >
          <Input
            id={`${idPrefix}-${wallet.id}`}
            type="radio"
            name={`${idPrefix}-wallet`}
            checked={selectedId === wallet.id}
            disabled={disabled}
            onChange={() => onSelect(wallet.id)}
            className="size-4 shrink-0 accent-primary"
          />
          <span className="min-w-0">
            <span className="block text-base font-bold">{wallet.alias}</span>
            <span
              className="mt-1 block truncate text-sm font-normal text-text-secondary"
              title={wallet.address}
            >
              {wallet.ensName
                ? `${wallet.ensName}${wallet.ensSuffix}`
                : `${wallet.address.slice(0, 6)}…${wallet.address.slice(-4)}`}
            </span>
            <span className="block text-sm font-normal text-text-secondary">
              Rede{" "}
              {wallet.network.charAt(0).toUpperCase() + wallet.network.slice(1)}
            </span>
          </span>
        </Label>
      </div>
    ))}
  </div>
);
