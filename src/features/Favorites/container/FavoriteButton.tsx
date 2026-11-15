import { useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/Dialog";
import { queryKeys } from "@/data/query-keys";
import type { Favorites } from "@/data/types/favorites";
import { AuthDialog } from "@/features/Auth/container/AuthDialog";
import { useSession } from "@/features/Auth/hooks/useSession";
import {
  favoritesQueryOptions,
  isFavoriteOwnerActive,
} from "@/lib/favorites-query";
import { FavoriteToggle } from "../components/FavoriteToggle";
import { useFavoriteMutation } from "../hooks/useFavoriteMutation";

type FavoriteButtonProps = {
  nftId: string;
  showLabel?: boolean;
  className?: string;
};

export const FavoriteButton = ({
  nftId,
  showLabel,
  className,
}: FavoriteButtonProps) => {
  const client = useQueryClient();
  const navigate = useNavigate();
  const href = useRouterState({ select: (state) => state.location.href });
  const [authOpen, setAuthOpen] = useState(false);
  const {
    data: user,
    isPending: sessionPending,
    refetch: refetchSession,
  } = useSession();

  const { data, isPending, isFetching, isError, refetch } = useQuery(
    favoritesQueryOptions(user?.id),
  );

  const requestLogin = () => {
    if (window.matchMedia("(min-width: 1024px)").matches) setAuthOpen(true);
    else void navigate({ to: "/login", search: { redirect: href } });
  };

  const { mutate, isSaving } = useFavoriteMutation(
    nftId,
    user?.id,
    requestLogin,
  );

  const onClick = async () => {
    let currentUser = user;

    if (currentUser === undefined) {
      const result = await refetchSession();

      if (result.isError) {
        toast.error("Não foi possível verificar sua sessão. Tente novamente.");
        return;
      }

      currentUser = result.data ?? null;
    }

    if (!currentUser) {
      requestLogin();
      return;
    }

    if (isError) {
      const result = await refetch();

      if (result.isError)
        toast.error("Não foi possível carregar os favoritos. Tente novamente.");

      return;
    }

    if (isSaving || !data || !isFavoriteOwnerActive(client, currentUser.id))
      return;

    const current = client.getQueryData<Favorites>(
      queryKeys.favorites.list(currentUser.id),
    );

    mutate({
      nftId,
      ownerId: currentUser.id,
      isFavorite: !current?.nftIds.includes(nftId),
    });
  };

  return (
    <>
      <FavoriteToggle
        isFavorite={Boolean(user && data?.nftIds.includes(nftId))}
        disabled={
          sessionPending ||
          isSaving ||
          Boolean(user && isPending && !isError) ||
          (isError && isFetching)
        }
        isSaving={isSaving}
        isError={Boolean(user && isError)}
        showLabel={showLabel}
        className={className}
        onClick={() => void onClick()}
      />
      {authOpen && !user && (
        <Dialog open={authOpen} onOpenChange={setAuthOpen}>
          <AuthDialog onAuthenticated={() => setAuthOpen(false)} />
        </Dialog>
      )}
    </>
  );
};
