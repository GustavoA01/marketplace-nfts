import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '@/components/page-placeholder'

const Page = () => {
  return <PagePlaceholder title="Mercado" />
}

export const Route = createFileRoute('/mercado/')({
  component: Page,
})
