import { useState } from "react";
import type { NFTDetail } from "@/data/types/catalogue";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";

type NFTGalleryProps = { gallery: NFTDetail["gallery"]; name: string };

export const NFTGallery = ({ gallery, name }: NFTGalleryProps) => {
  const [selected, setSelected] = useState(0);
  const { image, mobileImage, description } = gallery[selected] ?? gallery[0];
  return (
    <div className="relative flex min-w-0 flex-col gap-4 lg:w-143.25 lg:shrink-0 lg:flex-row lg:items-center lg:gap-7">
      <div className="hidden w-25 shrink-0 flex-col gap-4 lg:flex">
        {gallery.map((item, index) => (
          <Button
            key={index}
            type="button"
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
            variant="ghost"
            className="h-25 w-25 aria-pressed:ring-2 aria-pressed:ring-primary overflow-hidden border-0 rounded-lg p-0"
          >
            <img
              src={item.image}
              alt={item.description}
              width={100}
              height={100}
              className="size-25 rounded-lg object-cover"
            />
          </Button>
        ))}
      </div>
      <div className="relative flex h-126.5 w-full items-start justify-center rounded-t-[32px] bg-linear-to-br from-surface-card to-surface-raised px-7 pt-16.5 pb-0 lg:size-111 lg:rounded-md lg:bg-surface-card lg:bg-none lg:p-5">
        <picture className="block aspect-square w-full lg:h-full">
          <source media="(max-width: 1023px)" srcSet={mobileImage} />
          <img
            src={image}
            alt={description}
            width={404}
            height={404}
            fetchPriority="high"
            className="h-full w-full rounded-3xl object-cover"
          />
        </picture>
        <Button
          nativeButton={false}
          render={<Link to="/" />}
          variant="outline"
          size="icon"
          className="absolute top-6 left-7 rounded-full bg-surface-raised text-secondary lg:hidden"
        >
          <ChevronLeft className="size-5" />
          <span className="sr-only">Voltar ao catálogo</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-5 right-5 rounded-full bg-surface-raised text-primary lg:hidden"
        >
          <Heart className="size-5" />
          <span className="sr-only">Favoritar NFT</span>
        </Button>
        <Dialog>
          <DialogTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 hidden rounded-full bg-surface-raised lg:flex"
              >
                <Search className="size-5" />
                <span className="sr-only">Ampliar imagem</span>
              </Button>
            }
          />
          <DialogContent className="max-w-3xl p-5">
            <DialogTitle className="sr-only">{name}</DialogTitle>
            <img
              src={image}
              alt={description}
              width={700}
              height={700}
              className="max-h-[75svh] rounded-2xl object-contain"
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
