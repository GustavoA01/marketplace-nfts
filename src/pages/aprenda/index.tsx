import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '@/components/page-placeholder'

const Page = () => {
  return <PagePlaceholder title="Aprenda" />
}

export const Route = createFileRoute('/aprenda/')({
  component: Page,
})
