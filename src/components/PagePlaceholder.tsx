import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export const PagePlaceholder = ({ title }: { title: string }) => (
  <Card className="mx-auto w-full max-w-3xl">
    <CardHeader>
      <CardTitle>
        <h1>{title}</h1>
      </CardTitle>
    </CardHeader>
  </Card>
);
