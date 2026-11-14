import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '@/components/PagePlaceholder'

const Page = () => {
  return <PagePlaceholder title="Aprenda" />
}

export const Route = createFileRoute('/aprenda/')({
  component: Page,
})
