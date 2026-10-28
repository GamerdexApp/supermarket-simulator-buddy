import type { Playthrough } from "@/types/playthrough";
import { management } from "@/data/supermarket-simulator/management";
import { market } from "@/data/supermarket-simulator/market";

const sumOf = <Item>(
  items: Item[],
  owned: string[] | undefined,
  key: (item: Item) => string,
  price: (item: Item) => number,
) => {
  const ownedSet = new Set(owned ?? []);
  return items
    .filter((item) => ownedSet.has(key(item)))
    .reduce((sum, item) => sum + price(item), 0);
};

export interface Spending {
  licenses: number;
  growth: number;
  storage: number;
  tools: number;
  vehicles: number;
  management: number;
  market: number;
  total: number;
}

/**
 * What the playthrough paid for licenses, sections, tools and vehicles, as the old Dashboard
 * counted it. Hiring fees, furniture and paint are not part of it.
 */
export const spending = (playthrough: Playthrough): Spending => {
  const licenses = sumOf(
    management.licenses,
    playthrough.unlockedLicenses,
    (license) => license.id,
    (license) => license.price,
  );
  const growth = sumOf(
    management.growth,
    playthrough.unlockedGrowth,
    (section) => section.sectionNum,
    (section) => section.price,
  );
  const storage = sumOf(
    management.storage,
    playthrough.unlockedStorage,
    (section) => section.sectionNum,
    (section) => section.price,
  );
  const tools = sumOf(
    market.tools,
    playthrough.unlockedTools,
    (tool) => tool.name,
    (tool) => tool.unitPrice,
  );
  const vehicles = sumOf(
    market.vehicles,
    playthrough.unlockedVehicles,
    (vehicle) => vehicle.name,
    (vehicle) => vehicle.unitPrice,
  );
  const managementTotal = licenses + growth + storage;
  const marketTotal = tools + vehicles;
  return {
    licenses,
    growth,
    storage,
    tools,
    vehicles,
    management: managementTotal,
    market: marketTotal,
    total: managementTotal + marketTotal,
  };
};
