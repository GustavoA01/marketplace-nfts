import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { CheckoutField } from "./CheckoutField";
import { CheckoutSelect } from "./CheckoutSelect";

const fieldClassName =
  "h-10 rounded-sm border-border bg-transparent px-3 text-sm placeholder:text-secondary dark:bg-transparent";

export const CheckoutForm = ({
  idPrefix = "checkout",
}: {
  idPrefix?: string;
}) => {
  return (
    <section>
      <h1 className="mb-3 text-[17px] leading-5 font-bold">
        Perfil do colecionador
      </h1>
      <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        <CheckoutField
          id={`${idPrefix}-display`}
          label="Nome de exibição"
          required
        >
          <Input
            id={`${idPrefix}-display`}
            autoComplete="name"
            className={fieldClassName}
          />
        </CheckoutField>
        <CheckoutField
          id={`${idPrefix}-username`}
          label="Nome de usuário"
          required
        >
          <Input
            id={`${idPrefix}-username`}
            autoComplete="username"
            className={fieldClassName}
          />
        </CheckoutField>
        <CheckoutField id={`${idPrefix}-network`} label="Rede" required>
          <CheckoutSelect
            id={`${idPrefix}-network`}
            placeholder="Selecione uma rede"
            options={[
              { value: "ethereum", label: "Ethereum" },
              { value: "polygon", label: "Polygon" },
              { value: "solana", label: "Solana" },
            ]}
          />
        </CheckoutField>
        <CheckoutField
          id={`${idPrefix}-profile`}
          label="Nome do perfil"
          required
        >
          <Input id={`${idPrefix}-profile`} className={fieldClassName} />
        </CheckoutField>
        <CheckoutField
          id={`${idPrefix}-address`}
          label="Endereço da carteira"
          required
        >
          <Input
            id={`${idPrefix}-address`}
            placeholder="Endereço 0x da carteira"
            className={fieldClassName}
          />
        </CheckoutField>
        <CheckoutField id={`${idPrefix}-secondary`} label="Carteira secundária">
          <Input
            id={`${idPrefix}-secondary`}
            placeholder="ENS ou carteira secundária (opcional)"
            className={fieldClassName}
          />
        </CheckoutField>
        <CheckoutField
          id={`${idPrefix}-wallet-type`}
          label="Tipo de carteira"
          required
        >
          <CheckoutSelect
            id={`${idPrefix}-wallet-type`}
            placeholder="Selecione uma carteira"
            options={[
              { value: "metamask", label: "MetaMask" },
              { value: "walletconnect", label: "WalletConnect" },
              { value: "coinbase", label: "Coinbase Wallet" },
            ]}
          />
        </CheckoutField>
        <CheckoutField
          id={`${idPrefix}-referral`}
          label="Código de indicação"
          required
        >
          <Input id={`${idPrefix}-referral`} className={fieldClassName} />
        </CheckoutField>
        <CheckoutField id={`${idPrefix}-email`} label="E-mail" required>
          <Input
            id={`${idPrefix}-email`}
            type="email"
            autoComplete="email"
            className={fieldClassName}
          />
        </CheckoutField>
        <div className="w-24">
          <CheckoutField id={`${idPrefix}-ens`} label="Nome ENS" required>
            <CheckoutSelect
              id={`${idPrefix}-ens`}
              defaultValue="eth"
              options={[{ value: "eth", label: ".eth" }]}
            />
          </CheckoutField>
        </div>
      </div>
      <Label
        htmlFor={`${idPrefix}-other-wallet`}
        className="mt-6 flex items-center gap-2 text-[15px] font-normal"
      >
        <Input
          id={`${idPrefix}-other-wallet`}
          type="checkbox"
          className="size-4 accent-primary"
        />
        Usar outra carteira?
      </Label>
      <div className="mt-6 max-w-[350px]">
        <Label
          htmlFor={`${idPrefix}-note`}
          className="mb-3 text-[15px] font-normal"
        >
          Observação do colecionador (opcional)
        </Label>
        <Textarea
          id={`${idPrefix}-note`}
          rows={6}
          className="min-h-[152px] rounded-sm border-border bg-transparent dark:bg-transparent"
        />
      </div>
    </section>
  );
};
