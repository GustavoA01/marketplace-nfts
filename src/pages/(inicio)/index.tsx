import { createFileRoute } from "@tanstack/react-router";
import { DeskHero } from "./-components/DeskHero";
import { Catalogue } from "./-components/Catalogue";

const Page = () => {
  return (
    <>
      <DeskHero />
      <Catalogue />
    </>
  );
};

export const Route = createFileRoute("/(inicio)/")({
  component: Page,
});
