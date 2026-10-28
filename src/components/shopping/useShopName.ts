import { useTranslations } from "next-intl";
import { NO_SHOP, shopName } from "@/service/shopping";

/** Turns a store key into the shop name, with a translated label for no shop. */
export function useShopName() {
  const t = useTranslations("shopping");
  return (store: string) =>
    store === NO_SHOP ? t("shop.noShop") : shopName(store);
}
