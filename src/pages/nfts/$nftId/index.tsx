import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '@/components/page-placeholder'

const Page = () => {
  return <PagePlaceholder title="Detalhes do NFT" />
}

export const Route = createFileRoute('/nfts/$nftId/')({
  component: Page,
})
