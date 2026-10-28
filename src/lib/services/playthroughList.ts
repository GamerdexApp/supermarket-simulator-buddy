import type { Playthrough } from "@/types/playthrough";
import { management } from "@/data/supermarket-simulator/management";
import { readStoreLevel } from "./appData";

export type PlaythroughSort =
  "lastModified" | "name" | "createdAt" | "storeLevel";

const timestamp = (iso: string) => Date.parse(iso) || 0;

const SORTERS: Record<
  PlaythroughSort,
  (a: Playthrough, b: Playthrough) => number
> = {
  lastModified: (a, b) => timestamp(b.lastModified) - timestamp(a.lastModified),
  name: (a, b) => a.name.localeCompare(b.name),
  createdAt: (a, b) => timestamp(b.createdAt) - timestamp(a.createdAt),
  storeLevel: (a, b) => readStoreLevel(b) - readStoreLevel(a),
};

export const filterAndSort = (
  playthroughs: Playthrough[],
  search: string,
  sort: PlaythroughSort,
): Playthrough[] => {
  const needle = search.trim().toLowerCase();
  return playthroughs
    .filter((playthrough) => playthrough.name.toLowerCase().includes(needle))
    .sort(SORTERS[sort]);
};

/**
 * The playthrough that becomes active when `deletingId` is deleted while active: the most
 * recently updated of the others, matching `deletePlaythrough`.
 */
export const nextActiveAfterDelete = (
  playthroughs: Playthrough[],
  deletingId: string,
): Playthrough | null =>
  playthroughs
    .filter((playthrough) => playthrough.id !== deletingId)
    .sort(SORTERS.lastModified)[0] ?? null;

/** Ids that the game data no longer has are not counted. */
export const licensesUnlocked = (playthrough: Playthrough) => {
  const owned = new Set(playthrough.unlockedLicenses ?? []);
  return {
    owned: management.licenses.filter((license) => owned.has(license.id))
      .length,
    total: management.licenses.length,
  };
};

export const shoppingItemsBought = (playthrough: Playthrough) => {
  const items = playthrough.shoppingList ?? [];
  return {
    bought: items.filter((item) => item.purchased).length,
    total: items.length,
  };
};
