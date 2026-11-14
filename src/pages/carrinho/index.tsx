import { createFileRoute } from "@tanstack/react-router";
import { PurchaseBreadcrumb } from "@/components/PurchaseBreadcrumb";
import { CartItems } from "./-components/CartItems";
import { OrderSummary } from "./-components/OrderSummary";
import {
  cartItemsMock,
  mobileCartItemsMock,
  cartSummaryMock,
  mobileCartSummaryMock,
} from "@/data/mocks/temporary/purchase";
import { catalogueMocks } from "@/data/mocks/temporary/catalogue";
import { NFTRecommendations } from "@/components/NFTRecommendations";

const Page = () => (
  <div className="mb-16 pt-8 lg:mb-24 lg:pt-0">
    <div className="px-7 lg:px-0">
      <PurchaseBreadcrumb
        compact
        title="Carrinho"
        mobileTitle="Carrinho de NFTs"
      />
    </div>
    <div className="hidden items-start gap-12 lg:flex xl:gap-21.5">
      <div className="min-w-0 flex-1">
        <CartItems items={cartItemsMock} />
      </div>
      <aside className="w-83 shrink-0">
        <OrderSummary
          summary={cartSummaryMock}
          couponId="desktop-cart-coupon"
        />
      </aside>
    </div>
    <div className="lg:hidden">
      <div className="px-7">
        <CartItems items={mobileCartItemsMock} />
      </div>
      <div className="mt-6">
        <OrderSummary
          summary={mobileCartSummaryMock}
          couponId="mobile-cart-coupon"
        />
      </div>
    </div>
    <div className="px-6 lg:px-0">
      <NFTRecommendations
        title="Colecionadores também viram"
        items={catalogueMocks.filter((item) => item.name).slice(3, 8)}
      />
    </div>
  </div>
);

export const Route = createFileRoute("/carrinho/")({ component: Page });
