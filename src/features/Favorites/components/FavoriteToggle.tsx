import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";

export type FavoriteToggleProps = {
  isFavorite: boolean;
  disabled: boolean;
  isSaving: boolean;
  isError: boolean;
  showLabel?: boolean;
  className?: string;
  onClick: () => void;
};

export const FavoriteToggle = ({
  isFavorite,
  disabled,
  isSaving,
  isError,
  showLabel = false,
  className,
  onClick,
}: FavoriteToggleProps) => {
  const label = isError
    ? "Tentar carregar favoritos"
    : isFavorite
      ? "Remover dos favoritos"
      : "Favoritar NFT";
  return (
    <Button
      type="button"
      variant={showLabel ? "outline" : "ghost"}
      size={showLabel ? "default" : "icon"}
      className={className}
      disabled={disabled}
      aria-pressed={isFavorite}
      aria-busy={isSaving}
      title={label}
      onClick={onClick}
    >
      <Heart
        className="size-5"
        fill={isFavorite ? "currentColor" : "none"}
        strokeWidth={1.6}
      />
      {showLabel ? (
        isError ? (
          "Tentar novamente"
        ) : isFavorite ? (
          "Favoritado"
        ) : (
          "Favoritar"
        )
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </Button>
  );
};
