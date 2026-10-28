import type { Schema } from "@gamerdexapp/gamerdex-sync";

const dateOrder = (value: unknown) =>
  typeof value === "string" ? Date.parse(value) || 0 : 0;

/** A list of plain values. Additions and removals since the last sync carry over. */
const list: Schema = { type: "join" };

const playthrough: Schema = {
  type: "object",
  fields: {
    lastModified: { type: "max", order: dateOrder },
    storeLevel: { type: "max", order: (value) => Number(value) || 0 },
    unlockedLicenses: list,
    unlockedGrowth: list,
    unlockedStorage: list,
    hiredEmployees: list,
    unlockedTools: list,
    unlockedVehicles: list,
    activeLoans: list,
    shoppingList: { type: "keyed", key: "id", item: { type: "object" } },
  },
};

/**
 * The data file is the backup file, so its shape never changes. The store level takes the higher
 * side, because the game never lowers it. Unlock lists keep what either device added and drop what
 * either device removed. A loan entry never changes once taken, so the loans merge as a list too.
 * Shopping list items merge by id, field by field. A value that cannot merge, such as a name, a
 * description, or the boxes of one item, reports a conflict when both devices changed it. A
 * playthrough that one device deleted is deleted on the others, unless one of them changed it since
 * the last sync. Then the changed copy stays and the merge reports a conflict. The active
 * playthrough belongs to each device and never syncs.
 */
export const syncSchema: Schema = {
  type: "object",
  fields: {
    playthroughs: { type: "keyed", key: "id", item: playthrough },
    activePlaythroughId: { type: "local" },
  },
};
