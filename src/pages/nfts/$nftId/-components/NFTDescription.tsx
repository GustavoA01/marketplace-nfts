import type { NFTDetail } from "@/data/types/catalogue";

export const NFTDescription = ({ nft }: { nft: NFTDetail }) => {
  const detailParagraphs = nft.paragraphs.filter(
    (paragraph) => paragraph !== nft.description,
  );

  return (
    <section className="mt-8 px-6 lg:mt-24 lg:px-0">
      <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-border text-[17px] leading-5">
        <h2 className="border-b-[3px] border-primary pb-3 font-bold text-text-accent">
          Detalhes do NFT
        </h2>
        {nft.reviews !== undefined && (
          <span className="hidden pb-3 lg:inline">
            Avaliações de colecionadores ({nft.reviews})
          </span>
        )}
      </div>
      <div className="mt-3 space-y-6 text-sm leading-6 text-text-secondary">
        <div className="space-y-6 lg:hidden">
          {detailParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="hidden space-y-6 lg:block">
          {nft.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
      <dl className="mt-3 space-y-3 text-sm leading-6">
        {nft.metadata.map(({ label, value }) => (
          <div key={label}>
            <dt className="mb-3 font-bold">{label}:</dt>
            <dd className="text-text-secondary">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
