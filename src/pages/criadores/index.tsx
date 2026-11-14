import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '@/components/page-placeholder'

const Page = () => {
  return <PagePlaceholder title="Criadores" />
}

export const Route = createFileRoute('/criadores/')({
  component: Page,
})
