import { createFileRoute, Link } from "@tanstack/react-router";
import { NFTRecommendations } from "@/components/NFTRecommendations";
import { PurchaseBreadcrumb } from "@/components/PurchaseBreadcrumb";
import { catalogueMocks } from "@/data/mocks/temporary/catalogue";
import { nftDetailsMock } from "@/data/mocks/temporary/nft-details";
import { NFTGallery } from "./-components/NFTGallery";
import { NFTInformation } from "./-components/NFTInformation";
import { NFTDescription } from "./-components/NFTDescription";

const Page = () => {
  const { nftId } = Route.useParams();
  const selected = catalogueMocks.find(
    (nft) =>
      nft.id === nftId || (nftId === "1" && nft.id === "emerald-ape-042"),
  );

  if (!selected?.name)
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">NFT não encontrado</h1>
        <Link to="/" className="mt-4 inline-block text-primary">
          Voltar ao catálogo
        </Link>
      </div>
    );

  const nft =
    selected.id === "emerald-ape-042"
      ? nftDetailsMock
      : {
          ...nftDetailsMock,
          title: selected.name,
          price: selected.price ?? "0.00",
          image: selected.image,
          mobileImage: selected.image,
        };

  return (
    <div className="mb-16 lg:mb-24">
      <div className="hidden lg:block">
        <PurchaseBreadcrumb compact mobileTitle="Detalhes do NFT" />
      </div>
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <NFTGallery
          image={nft.image}
          mobileImage={nft.mobileImage}
          name={nft.title}
        />
        <NFTInformation nft={nft} />
      </div>
      <NFTDescription nft={nft} />
      <div className="px-6 lg:px-0">
        <NFTRecommendations
          title="Mais desta coleção"
          items={catalogueMocks
            .filter((item) => item.name && item.id !== selected.id)
            .slice(2, 7)}
        />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/nfts/$nftId/")({ component: Page });
