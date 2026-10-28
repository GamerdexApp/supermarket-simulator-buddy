import type { AppData, Playthrough } from "@/types/playthrough";

export type NewPlaythrough = Pick<Playthrough, "name" | "description">;

export type UnlockListField =
  | "unlockedLicenses"
  | "unlockedGrowth"
  | "unlockedStorage"
  | "hiredEmployees"
  | "unlockedTools"
  | "unlockedVehicles";

const STARTER_LICENSES = ["license_0"];
const STARTER_GROWTH = ["1"];
const STARTER_TOOLS = ["Paper Bag", "Sponge", "Mop"];

/** Every new playthrough becomes the active one. The old app did this only for the first. */
export const addPlaythrough = (
  current: AppData,
  input: NewPlaythrough,
  now = new Date(),
  id = crypto.randomUUID(),
): AppData => {
  const timestamp = now.toISOString();
  const created: Playthrough = {
    ...input,
    id,
    createdAt: timestamp,
    lastModified: timestamp,
    unlockedLicenses: [...STARTER_LICENSES],
    unlockedGrowth: [...STARTER_GROWTH],
    unlockedTools: [...STARTER_TOOLS],
  };
  return {
    ...current,
    playthroughs: [...current.playthroughs, created],
    activePlaythroughId: created.id,
  };
};

export const updatePlaythrough = (
  current: AppData,
  id: string,
  updates: Partial<Playthrough>,
  now = new Date(),
): AppData => ({
  ...current,
  playthroughs: current.playthroughs.map((playthrough) =>
    playthrough.id === id
      ? { ...playthrough, ...updates, lastModified: now.toISOString() }
      : playthrough,
  ),
});

/** Applies `change` to one playthrough, read from `current` so it is never stale. */
export const changePlaythrough = (
  current: AppData,
  id: string,
  change: (playthrough: Playthrough) => Partial<Playthrough>,
  now = new Date(),
): AppData => {
  const playthrough = current.playthroughs.find((p) => p.id === id);
  return playthrough
    ? updatePlaythrough(current, id, change(playthrough), now)
    : current;
};

const mostRecentlyModified = (playthroughs: Playthrough[]) =>
  playthroughs.reduce<Playthrough | null>(
    (latest, playthrough) =>
      latest === null || playthrough.lastModified > latest.lastModified
        ? playthrough
        : latest,
    null,
  );

/** Deleting the active playthrough activates the most recently updated one that is left. */
export const deletePlaythrough = (current: AppData, id: string): AppData => {
  const playthroughs = current.playthroughs.filter(
    (playthrough) => playthrough.id !== id,
  );
  return {
    ...current,
    playthroughs,
    activePlaythroughId:
      current.activePlaythroughId === id
        ? (mostRecentlyModified(playthroughs)?.id ?? null)
        : current.activePlaythroughId,
  };
};

export const setActivePlaythrough = (
  current: AppData,
  id: string | null,
): AppData => ({ ...current, activePlaythroughId: id });

/** A stored level below 0 reads as 0, as does a missing level. */
export const readStoreLevel = (playthrough: Playthrough): number =>
  Math.max(0, playthrough.storeLevel ?? 0);

export const setStoreLevel = (
  current: AppData,
  id: string,
  level: number,
  now = new Date(),
): AppData =>
  updatePlaythrough(
    current,
    id,
    { storeLevel: Math.max(0, Math.floor(level)) },
    now,
  );

/** Adds `value` only when it is absent, so a fast double click cannot store it twice. */
export const addToList = (
  current: AppData,
  id: string,
  field: UnlockListField,
  values: string[],
  now = new Date(),
): AppData =>
  changePlaythrough(
    current,
    id,
    (playthrough) => {
      const list = playthrough[field] ?? [];
      const missing = values.filter(
        (value, index) =>
          !list.includes(value) && values.indexOf(value) === index,
      );
      return { [field]: [...list, ...missing] };
    },
    now,
  );

/** Removes every copy of each value. */
export const removeFromList = (
  current: AppData,
  id: string,
  field: UnlockListField,
  values: string[],
  now = new Date(),
): AppData =>
  changePlaythrough(
    current,
    id,
    (playthrough) => ({
      [field]: (playthrough[field] ?? []).filter(
        (value) => !values.includes(value),
      ),
    }),
    now,
  );
