export type NFTPreview = {
  id: string;
  name?: string;
  image: string;
  imageDescription: string;
  price?: string;
  previousPrice?: string;
  portrait?: boolean;
  rare?: boolean;
};

export type NFT = NFTPreview & {
  version?: number;
  name: string;
  price: string;
  category: string;
  network: string;
  createdAt: string;
  trending: boolean;
  description: string;
  collection: string;
  creator: string;
  editions: string[];
  availableQuantity: number;
};
