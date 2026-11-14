import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '@/components/PagePlaceholder'

const Page = () => {
  return <PagePlaceholder title="Detalhes do NFT" />
}

export const Route = createFileRoute('/nfts/$nftId/')({
  component: Page,
})
