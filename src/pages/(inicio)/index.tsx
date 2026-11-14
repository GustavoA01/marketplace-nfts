import { createFileRoute } from "@tanstack/react-router";
import { DeskHero } from "./-components/DeskHero";
import { Catalogue } from "./-components/Catalogue";
import { HomePromos } from "./-components/HomePromos";
import { Journal } from "./-components/Journal";
import { MobileHero } from "./-components/MobileHero";
import { MobileBottomNavigation } from "@/components/MobileBottomNavigation";

const Page = () => {
  return (
    <>
      <div className="hidden lg:block">
        <DeskHero />
      </div>
      <MobileHero />
      <Catalogue />
      <HomePromos />
      <Journal />
      <MobileBottomNavigation />
    </>
  );
};

export const Route = createFileRoute("/(inicio)/")({ component: Page });
