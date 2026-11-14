import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '@/components/page-placeholder'

const Page = () => {
  return <PagePlaceholder title="Carteiras" />
}

export const Route = createFileRoute('/carteiras/')({
  component: Page,
})
