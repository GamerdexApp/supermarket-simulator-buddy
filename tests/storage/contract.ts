import { beforeEach, describe, expect, it } from "vitest";
import type { AppData, Playthrough } from "@/types/playthrough";
import {
  barePlaythrough,
  completeFixtures,
  emptyPlaythrough,
  playthroughWithUnknownFields,
  progressedPlaythrough,
} from "./fixtures";

export const STORAGE_KEY = "supermarket-simulator-buddy";

export interface StorageAdapter {
  load(): AppData;
  add(input: Pick<Playthrough, "name" | "description">): void;
  update(id: string, updates: Partial<Playthrough>): void;
  remove(id: string): void;
  setActive(id: string | null): void;
  exportJson(): string;
  importText(text: string): { success: boolean; error?: string };
  clear(): void;
}

const seed = (data: AppData) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

const stored = (): AppData =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as AppData;

const asAppData = (
  playthroughs: Playthrough[],
  active: string | null,
): AppData => ({ playthroughs, activePlaythroughId: active });

/** Behavior that the old app and the rebuild share. Rules that changed on purpose are tested on the new store only. */
export function describeStorageContract(
  label: string,
  createAdapter: () => StorageAdapter,
) {
  describe(`storage contract: ${label}`, () => {
    let adapter: StorageAdapter;

    beforeEach(() => {
      localStorage.clear();
      adapter = createAdapter();
    });

    it("starts empty when nothing is stored", () => {
      expect(adapter.load()).toEqual({
        playthroughs: [],
        activePlaythroughId: null,
      });
    });

    it("loads a complete save unchanged", () => {
      const saved = asAppData(completeFixtures(), progressedPlaythrough().id);
      seed(saved);

      expect(adapter.load()).toEqual(saved);
    });

    it("keeps unknown fields and ids that the game data no longer has", () => {
      const fixture = playthroughWithUnknownFields();
      seed(asAppData([fixture], fixture.id));

      expect(adapter.load().playthroughs[0]).toEqual(fixture);
    });

    it("keeps unknown top level fields", () => {
      const saved = { ...asAppData([emptyPlaythrough()], null), extra: 1 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      expect(adapter.load()).toMatchObject({ extra: 1 });
    });

    it("does not fill in missing optional fields", () => {
      const fixture = barePlaythrough();
      seed(asAppData([fixture], fixture.id));

      expect(adapter.load().playthroughs[0]).toEqual(fixture);
    });

    it("seeds the starter unlocks on a new playthrough", () => {
      adapter.add({ name: "First" });

      const [created] = stored().playthroughs;

      expect(created).toMatchObject({
        name: "First",
        unlockedLicenses: ["license_0"],
        unlockedGrowth: ["1"],
        unlockedTools: ["Paper Bag", "Sponge", "Mop"],
      });
      expect(created.storeLevel).toBeUndefined();
      expect(created.createdAt).toBe(created.lastModified);
      expect(stored().activePlaythroughId).toBe(created.id);
    });

    it("updates a playthrough and touches only lastModified besides the changes", () => {
      const fixture = progressedPlaythrough();
      seed(asAppData([fixture], fixture.id));

      adapter.update(fixture.id, { name: "Renamed" });

      const { lastModified: before, ...rest } = fixture;
      const { lastModified: after, ...updatedRest } = stored().playthroughs[0];

      expect(updatedRest).toEqual({ ...rest, name: "Renamed" });
      expect(after).not.toBe(before);
    });

    it("deletes a playthrough and keeps the active one when another is deleted", () => {
      const first = emptyPlaythrough();
      const second = progressedPlaythrough();
      seed(asAppData([first, second], second.id));

      adapter.remove(first.id);

      expect(stored()).toEqual(asAppData([second], second.id));
    });

    it("sets and clears the active playthrough", () => {
      const first = emptyPlaythrough();
      const second = progressedPlaythrough();
      seed(asAppData([first, second], first.id));

      adapter.setActive(second.id);
      expect(stored().activePlaythroughId).toBe(second.id);

      adapter.setActive(null);
      expect(stored().activePlaythroughId).toBeNull();
    });

    it("exports the stored object as JSON with two space indents", () => {
      const saved = asAppData(completeFixtures(), null);
      seed(saved);

      expect(adapter.exportJson()).toBe(JSON.stringify(saved, null, 2));
    });

    it("imports an export file and gives the same data back", () => {
      const saved = asAppData(completeFixtures(), progressedPlaythrough().id);
      seed(saved);
      const file = adapter.exportJson();
      adapter.clear();

      expect(adapter.importText(file)).toEqual({ success: true });
      expect(adapter.load()).toEqual(saved);
    });

    it("rejects a file without a playthroughs array and keeps the stored data", () => {
      const saved = asAppData([emptyPlaythrough()], null);
      seed(saved);

      expect(
        adapter.importText(JSON.stringify({ hello: "world" })).success,
      ).toBe(false);
      expect(stored()).toEqual(saved);
    });

    it("rejects text that is not JSON and keeps the stored data", () => {
      const saved = asAppData([emptyPlaythrough()], null);
      seed(saved);

      expect(adapter.importText("not json").success).toBe(false);
      expect(stored()).toEqual(saved);
    });

    it("removes the key on clear", () => {
      seed(asAppData([emptyPlaythrough()], null));

      adapter.clear();

      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });
}
