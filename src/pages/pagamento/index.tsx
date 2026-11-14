import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '@/components/PagePlaceholder'

const Page = () => {
  return <PagePlaceholder title="Pagamento" />
}

export const Route = createFileRoute('/pagamento/')({
  component: Page,
})
