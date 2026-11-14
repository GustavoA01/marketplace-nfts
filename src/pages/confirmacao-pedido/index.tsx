import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '@/components/PagePlaceholder'

const Page = () => {
  return <PagePlaceholder title="Confirmação de pedido" />
}

export const Route = createFileRoute('/confirmacao-pedido/')({
  component: Page,
})
