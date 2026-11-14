import { Image } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FieldLabel } from "@/components/FieldLabel";

type AvatarFieldProps = {
  hasAvatar: boolean;
  alt: string;
  avatarUrl?: string;
  disabled?: boolean;
  onChangeClick: () => void;
  onRemoveClick: () => void;
};

export const AvatarField = ({
  hasAvatar,
  alt,
  avatarUrl,
  disabled = false,
  onChangeClick,
  onRemoveClick,
}: AvatarFieldProps) => {
  return (
    <div className="flex w-full flex-col gap-2.5">
      <FieldLabel>Avatar</FieldLabel>
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex size-11 items-center justify-center rounded-full border border-border bg-surface-raised p-2.5 sm:size-12.5 sm:p-3">
          {hasAvatar && avatarUrl ? (
            <img
              src={avatarUrl}
              alt={alt}
              className="size-5 rounded-full object-cover sm:size-6"
            />
          ) : (
            <Image
              className="size-5 text-secondary sm:size-6"
              strokeWidth={1.6}
              aria-hidden
            />
          )}
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <Button
            type="button"
            disabled={disabled}
            onClick={onChangeClick}
            className="h-9 w-20 rounded-[3px] font-mono text-xs font-bold text-ink sm:h-10 sm:w-24.5 sm:text-sm"
          >
            Alterar
          </Button>
          <button
            type="button"
            disabled={disabled || !hasAvatar}
            onClick={onRemoveClick}
            className="font-mono text-xs leading-4 text-foreground outline-none transition-colors hover:text-text-accent focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 sm:text-sm"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
};
