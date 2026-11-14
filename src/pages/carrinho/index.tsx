import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '@/components/page-placeholder'

const Page = () => {
  return <PagePlaceholder title="Carrinho de NFTs" />
}

export const Route = createFileRoute('/carrinho/')({
  component: Page,
})
