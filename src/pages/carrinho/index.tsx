import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '@/components/PagePlaceholder'

const Page = () => {
  return <PagePlaceholder title="Carrinho de NFTs" />
}

export const Route = createFileRoute('/carrinho/')({
  component: Page,
})
