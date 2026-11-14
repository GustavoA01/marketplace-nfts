import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '@/components/PagePlaceholder'

const Page = () => {
  return <PagePlaceholder title="Cadastro" />
}

export const Route = createFileRoute('/cadastro/')({
  component: Page,
})
