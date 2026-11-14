import { createFileRoute } from '@tanstack/react-router'
import { Hero } from './-components/DeskHero'

const Page = () => {
  return <Hero />
}

export const Route = createFileRoute('/(inicio)/')({
  component: Page,
})
