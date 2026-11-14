import { Image } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { FieldLabel } from "@/components/FieldLabel";
import { cn } from "@/lib/utils";

type AvatarFieldProps = {
  hasAvatar: boolean;
  alt: string;
  avatarUrl?: string;
  disabled?: boolean;
  onFileSelect: (file: File) => void;
  onRemoveClick: () => void;
};

export const AvatarField = ({
  hasAvatar,
  alt,
  avatarUrl,
  disabled = false,
  onFileSelect,
  onRemoveClick,
}: AvatarFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex w-full flex-col gap-2.5">
      <FieldLabel>Avatar</FieldLabel>
      <div className="flex items-center gap-4 sm:gap-6">
        <div
          className={cn(
            "flex size-11 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-raised sm:size-12.5",
            !(hasAvatar && avatarUrl) && "p-2.5 sm:p-3",
          )}
        >
          {hasAvatar && avatarUrl ? (
            <img src={avatarUrl} alt={alt} className="size-full object-cover" />
          ) : (
            <Image
              className="size-5 text-secondary sm:size-6"
              strokeWidth={1.6}
              aria-hidden
            />
          )}
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={disabled}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onFileSelect(file);
              event.target.value = "";
            }}
          />
          <Button
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
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
