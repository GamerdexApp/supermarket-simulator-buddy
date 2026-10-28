import type { Playthrough } from "@/types/playthrough";
import { management } from "@/data/supermarket-simulator/management";
import { market } from "@/data/supermarket-simulator/market";
import { loanTotals } from "./bank";
import { allEmployees, countKnown, hiringTotals } from "./management";
import { toolNames, vehicleNames } from "./market";
import { unlockedProductCount } from "./navCounts";
import { spending } from "./spending";

/** Every figure on the Overview. The page only reads, so all of it is derived. */
export const overviewFigures = (playthrough: Playthrough) => {
  const spent = spending(playthrough);
  const hiring = hiringTotals(allEmployees, playthrough);
  const known = (ids: string[] | undefined, all: string[]) => ({
    owned: countKnown(ids, all),
    total: all.length,
  });
  return {
    spent,
    loans: loanTotals(playthrough),
    licenses: known(
      playthrough.unlockedLicenses,
      management.licenses.map((license) => license.id),
    ),
    growth: known(
      playthrough.unlockedGrowth,
      management.growth.map((section) => section.sectionNum),
    ),
    storage: known(
      playthrough.unlockedStorage,
      management.storage.map((section) => section.sectionNum),
    ),
    employees: { owned: hiring.hired, total: hiring.total },
    dailyWages: hiring.dailyWages,
    hiringCosts: hiring.hiringCosts,
    productsAvailable: unlockedProductCount(playthrough),
    tools: known(playthrough.unlockedTools, toolNames),
    vehicles: known(playthrough.unlockedVehicles, vehicleNames),
    furniture: market.furnitures.length,
  };
};
