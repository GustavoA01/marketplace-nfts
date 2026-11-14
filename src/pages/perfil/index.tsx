import { createFileRoute } from '@tanstack/react-router'
import { PagePlaceholder } from '@/components/page-placeholder'

const Page = () => {
  return <PagePlaceholder title="Perfil do colecionador" />
}

export const Route = createFileRoute('/perfil/')({
  component: Page,
})
