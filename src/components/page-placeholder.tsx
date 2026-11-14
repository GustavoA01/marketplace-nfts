import { Card, CardHeader, CardTitle } from '@/components/ui/card'

type PagePlaceholderProps = {
  title: string
}

export const PagePlaceholder = ({ title }: PagePlaceholderProps) => {
  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle><h1>{title}</h1></CardTitle>
      </CardHeader>
    </Card>
  )
}
