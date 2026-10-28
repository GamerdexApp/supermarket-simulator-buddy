import type { Playthrough } from "@/types/playthrough";
import type { NavItemId } from "@/data/nav";
import { market } from "@/data/supermarket-simulator/market";

export const unlockedProductCount = (playthrough: Playthrough): number => {
  const licenses = new Set(playthrough.unlockedLicenses ?? []);
  return market.products.filter((product) => licenses.has(product.licenseId))
    .length;
};

export const openShoppingItemCount = (playthrough: Playthrough): number =>
  (playthrough.shoppingList ?? []).filter((item) => !item.purchased).length;

/** The count beside a sidebar link. Shopping list hides its count when nothing is open. */
export const navCount = (
  id: NavItemId,
  playthrough: Playthrough,
): number | null => {
  if (id === "market") return unlockedProductCount(playthrough);
  if (id === "shoppingList") {
    const open = openShoppingItemCount(playthrough);
    return open > 0 ? open : null;
  }
  return null;
};
