import type { NFTDetailsPreview } from "@/data/mocks/temporary/nft-details";

export const NFTDescription = ({ nft }: { nft: NFTDetailsPreview }) => {
  return (
    <section className="mt-12 px-6 lg:mt-24 lg:px-0">
      <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-border text-[17px] leading-5">
        <h2 className="border-b-[3px] border-primary pb-3 font-bold text-text-accent">
          Detalhes do NFT
        </h2>
        <span className="pb-3">
          Avaliações de colecionadores ({nft.reviews})
        </span>
      </div>
      <div className="mt-3 space-y-6 text-sm leading-6 text-text-secondary">
        {nft.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
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
