import type { Product } from "@/types";
import type {
  AppData,
  Playthrough,
  ShoppingListItem,
} from "@/types/playthrough";
import {
  DELI_AND_GROCERY_LOCATION,
  GREEN_MARKET_LOCATION,
  JANITORIAL_SUPPLY_LOCATION,
  LIQUOR_STORE_LOCATION,
  MEAT_AND_DAIRY_LOCATION,
} from "@/data/constants/supermarket-simulator";
import { market } from "@/data/supermarket-simulator/market";
import { changePlaythrough } from "./appData";
import { currentProductName } from "./products";

const SHOP_NAMES: Record<string, string> = {
  [DELI_AND_GROCERY_LOCATION]: "Deli and Grocery", // i18n-ignore
  [MEAT_AND_DAIRY_LOCATION]: "Meat and Dairy", // i18n-ignore
  [GREEN_MARKET_LOCATION]: "Green Market", // i18n-ignore
  [LIQUOR_STORE_LOCATION]: "Liquor Store", // i18n-ignore
  [JANITORIAL_SUPPLY_LOCATION]: "Janitorial Supply", // i18n-ignore
};

const SHOP_ORDER = [
  DELI_AND_GROCERY_LOCATION,
  MEAT_AND_DAIRY_LOCATION,
  GREEN_MARKET_LOCATION,
  LIQUOR_STORE_LOCATION,
  JANITORIAL_SUPPLY_LOCATION,
];

/** The store key of a product that no shop sells. */
export const NO_SHOP = "";

/**
 * The in-game shop name, which stays English. An unknown key shows as it is stored,
 * as the old page did. The caller translates the label for NO_SHOP.
 */
export const shopName = (store: string) => SHOP_NAMES[store] ?? store;

/** The known shops in game order, then any other key, then items with no shop. */
const shopRank = (store: string) => {
  const index = SHOP_ORDER.indexOf(store);
  if (index >= 0) return index;
  return store === NO_SHOP ? 999 : 500;
};

export interface ShopGroup {
  store: string;
  items: ShoppingListItem[];
  bought: number;
  boxes: number;
}

export const groupByShop = (items: ShoppingListItem[]): ShopGroup[] => {
  const groups = new Map<string, ShoppingListItem[]>();
  items.forEach((item) =>
    groups.set(item.store, [...(groups.get(item.store) ?? []), item]),
  );
  return [...groups.entries()]
    .sort(([a], [b]) => shopRank(a) - shopRank(b))
    .map(([store, shopItems]) => ({
      store,
      items: shopItems,
      bought: shopItems.filter((item) => item.purchased).length,
      boxes: shopItems.reduce((sum, item) => sum + item.boxes, 0),
    }));
};

export const listSummary = (items: ShoppingListItem[]) => ({
  total: items.length,
  bought: items.filter((item) => item.purchased).length,
  boxes: items.reduce((sum, item) => sum + item.boxes, 0),
});

/** Products whose license is unlocked, the only ones the add dialog lists. */
export const addableProducts = (playthrough: Playthrough): Product[] => {
  const licenses = new Set(playthrough.unlockedLicenses ?? []);
  return market.products.filter((product) => licenses.has(product.licenseId));
};

export interface PendingItem {
  productName: string;
  company?: string;
  store: string;
  boxes: number;
}

export const pendingKey = (
  item: Pick<PendingItem, "productName" | "company" | "store">,
) =>
  [currentProductName(item.productName), item.company ?? "", item.store].join(
    "|",
  );

export const toPending = (product: Product): PendingItem => ({
  productName: product.name,
  company: product.company,
  store: product.bigBoxStore ?? "",
  boxes: 1,
});

/**
 * Adds pending items to the list. A product already on the list with the same name, company and
 * shop, and not yet purchased, gets the boxes added to that row instead of a second row.
 */
export const addItems = (
  current: AppData,
  playthroughId: string,
  pending: PendingItem[],
  newId: () => string = () => crypto.randomUUID(),
  now = new Date(),
): AppData =>
  changePlaythrough(
    current,
    playthroughId,
    (playthrough) => {
      const list = [...(playthrough.shoppingList ?? [])];
      pending.forEach((item) => {
        const index = list.findIndex(
          (row) => !row.purchased && pendingKey(row) === pendingKey(item),
        );
        if (index >= 0) {
          list[index] = {
            ...list[index],
            boxes: list[index].boxes + item.boxes,
          };
        } else {
          list.push({
            id: newId(),
            productName: item.productName,
            ...(item.company !== undefined && { company: item.company }),
            boxes: item.boxes,
            purchased: false,
            store: item.store,
          });
        }
      });
      return { shoppingList: list };
    },
    now,
  );

const changeItem = (
  current: AppData,
  playthroughId: string,
  itemId: string,
  change: (item: ShoppingListItem) => ShoppingListItem,
  now: Date,
) =>
  changePlaythrough(
    current,
    playthroughId,
    (playthrough) => ({
      shoppingList: (playthrough.shoppingList ?? []).map((item) =>
        item.id === itemId ? change(item) : item,
      ),
    }),
    now,
  );

export const setBoxes = (
  current: AppData,
  playthroughId: string,
  itemId: string,
  boxes: number,
  now = new Date(),
) =>
  changeItem(
    current,
    playthroughId,
    itemId,
    (item) => ({ ...item, boxes: Math.max(1, boxes) }),
    now,
  );

export const togglePurchased = (
  current: AppData,
  playthroughId: string,
  itemId: string,
  now = new Date(),
) =>
  changeItem(
    current,
    playthroughId,
    itemId,
    (item) => ({ ...item, purchased: !item.purchased }),
    now,
  );

export const removeItem = (
  current: AppData,
  playthroughId: string,
  itemId: string,
  now = new Date(),
) =>
  changePlaythrough(
    current,
    playthroughId,
    (playthrough) => ({
      shoppingList: (playthrough.shoppingList ?? []).filter(
        (item) => item.id !== itemId,
      ),
    }),
    now,
  );

export const resetList = (
  current: AppData,
  playthroughId: string,
  now = new Date(),
) =>
  changePlaythrough(current, playthroughId, () => ({ shoppingList: [] }), now);
