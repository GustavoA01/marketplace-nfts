import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '@/components/page-placeholder'

const Page = () => {
  return <PagePlaceholder title="Login" />
}

export const Route = createFileRoute('/login/')({
  component: Page,
})
