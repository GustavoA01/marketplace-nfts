export type NFTPreview = {
  id: string
  name?: string
  image: string
  imageDescription: string
  price?: string
  previousPrice?: string
  portrait?: boolean
  rare?: boolean
  favorite?: "outline" | "filled"
}
