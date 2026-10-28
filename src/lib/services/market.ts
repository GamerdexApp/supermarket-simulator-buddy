import type { Product, Tool, Vehicle } from "@/types";
import type { Playthrough } from "@/types/playthrough";
import {
  CATEGORIES,
  DISPLAY_TYPES,
} from "@/data/constants/supermarket-simulator";
import { management } from "@/data/supermarket-simulator/management";
import { market } from "@/data/supermarket-simulator/market";
import { readStoreLevel } from "./appData";
import { countKnown, type UnlockState } from "./management";

/** "garment_rack" reads as "Garment Rack", as the old cards showed it. */
export const labelOf = (value: string) =>
  value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const isProductUnlocked = (product: Product, playthrough: Playthrough) =>
  (playthrough.unlockedLicenses ?? []).includes(product.licenseId);

export interface ProductQuery {
  search: string;
  displayType: string;
  category: string;
}

export const ALL = "all";

/** Name or company, without case, as the old search matched. */
export const filterProducts = (
  products: Product[],
  { search, displayType, category }: ProductQuery,
) => {
  const needle = search.trim().toLowerCase();
  return products.filter(
    (product) =>
      (product.name.toLowerCase().includes(needle) ||
        (product.company?.toLowerCase().includes(needle) ?? false)) &&
      (displayType === ALL || product.displayType === displayType) &&
      (category === ALL || product.category === category),
  );
};

/**
 * Options with their product counts. A value no product uses is left out, so a filter never
 * returns nothing for a reason the list does not show.
 */
const optionsWithCounts = (
  values: readonly string[],
  valueOf: (product: Product) => string | undefined,
) =>
  values
    .map((value) => ({
      id: value,
      count: market.products.filter((product) => valueOf(product) === value)
        .length,
    }))
    .filter((option) => option.count > 0);

export const displayTypeOptions = optionsWithCounts(
  DISPLAY_TYPES,
  (product) => product.displayType,
);
export const categoryOptions = optionsWithCounts(
  CATEGORIES,
  (product) => product.category,
);

/** Products share names across companies, so the key needs all three. */
export const productKey = (product: Product) =>
  [product.licenseId, product.name, product.company ?? ""].join("|");

export const licenseLabel = (licenseId: string) =>
  `License ${licenseId.replace("license_", "")}`;

const licenseIds = management.licenses.map((license) => license.id);

export const ownedLicenseCount = (playthrough: Playthrough) =>
  countKnown(playthrough.unlockedLicenses, licenseIds);

export const toolState = (
  tool: Tool,
  playthrough: Playthrough,
): UnlockState => {
  if ((playthrough.unlockedTools ?? []).includes(tool.name)) return "unlocked";
  return ownedLicenseCount(playthrough) >= (tool.requiredLicenses ?? 0)
    ? "canUnlock"
    : "locked";
};

export const vehicleState = (
  vehicle: Vehicle,
  playthrough: Playthrough,
): UnlockState => {
  if ((playthrough.unlockedVehicles ?? []).includes(vehicle.name))
    return "unlocked";
  return readStoreLevel(playthrough) >= vehicle.storeLevel
    ? "canUnlock"
    : "locked";
};

export const toolNames = market.tools.map((tool) => tool.name);
export const vehicleNames = market.vehicles.map((vehicle) => vehicle.name);
