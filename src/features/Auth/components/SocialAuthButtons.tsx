import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type SocialAuthButtonsProps = {
  onGoogleClick?: () => void;
  onFacebookClick?: () => void;
  padded?: boolean;
};

export const SocialAuthButtons = ({
  onGoogleClick,
  onFacebookClick,
  padded = true,
}: SocialAuthButtonsProps) => {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <span className="h-px flex-1 bg-border" />
        <p className="shrink-0 font-mono text-[13px] leading-4 text-foreground">
          Ou continue com
        </p>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className={cn("flex flex-col gap-4", padded && "px-6 sm:px-20")}>
        <Button
          type="button"
          variant="outline"
          onClick={onGoogleClick}
          className="h-10 w-full gap-3 rounded-[5px] border-border bg-transparent font-mono text-[13px] font-medium text-text-secondary hover:bg-surface-raised hover:text-text-secondary"
        >
          <img src="/icons/google.svg" alt="" width={20} height={20} />
          Continuar com Google
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onFacebookClick}
          className="h-10 w-full gap-3 rounded-[5px] border-border bg-transparent font-mono text-[13px] font-medium text-text-secondary hover:bg-surface-raised hover:text-text-secondary"
        >
          <img src="/icons/facebook-auth.svg" alt="" width={20} height={20} />
          Continuar com Facebook
        </Button>
      </div>
    </div>
  );
};
