import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '@/components/page-placeholder'

const Page = () => {
  return <PagePlaceholder title="Cadastro" />
}

export const Route = createFileRoute('/cadastro/')({
  component: Page,
})
