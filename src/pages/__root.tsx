import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Header } from '@/components/Header'

const RootLayout = () => {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <main className="container mx-auto mt-6 px-5 pb-6 sm:px-8">
        <Outlet />
      </main>
    </div>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => <h1>Página não encontrada</h1>,
})
