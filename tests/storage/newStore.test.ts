import { afterEach, describe, expect, it } from "vitest";
import type { AppData } from "@/types/playthrough";
import * as appData from "@/service/appData";
import { applyImport, backupText, parseBackup } from "@/service/backup";
import { STORAGE_KEY, storageService } from "@/service/storage";
import { describeStorageContract } from "./contract";
import {
  barePlaythrough,
  emptyPlaythrough,
  progressedPlaythrough,
} from "./fixtures";

const apply = (change: (current: AppData) => AppData) =>
  storageService.save(change(storageService.load()));

describeStorageContract("new store", () => ({
  load: storageService.load,
  add: (input) => apply((current) => appData.addPlaythrough(current, input)),
  update: (id, updates) =>
    apply((current) => appData.updatePlaythrough(current, id, updates)),
  remove: (id) => apply((current) => appData.deletePlaythrough(current, id)),
  setActive: (id) =>
    apply((current) => appData.setActivePlaythrough(current, id)),
  exportJson: () => backupText(storageService.load()),
  importText: (text) => {
    const parsed = parseBackup(text);
    if (!parsed.ok) return { success: false, error: parsed.error };
    storageService.save(
      applyImport(storageService.load(), parsed.data, "replace"),
    );
    return { success: true };
  },
  clear: () => storageService.clear(),
}));

const asAppData = (
  playthroughs: AppData["playthroughs"],
  active: string | null = null,
): AppData => ({ playthroughs, activePlaythroughId: active });

const now = new Date("2026-04-01T00:00:00.000Z");

describe("new store rules", () => {
  afterEach(() => localStorage.clear());

  it("makes every new playthrough the active one", () => {
    const first = emptyPlaythrough();

    const result = appData.addPlaythrough(
      asAppData([first], first.id),
      { name: "Second" },
      now,
      "new-id",
    );

    expect(result.activePlaythroughId).toBe("new-id");
  });

  it("activates the most recently updated playthrough when the active one is deleted", () => {
    const oldest = {
      ...emptyPlaythrough(),
      id: "a",
      lastModified: "2026-01-01T00:00:00.000Z",
    };
    const newest = {
      ...emptyPlaythrough(),
      id: "b",
      lastModified: "2026-03-01T00:00:00.000Z",
    };
    const active = {
      ...emptyPlaythrough(),
      id: "c",
      lastModified: "2026-02-01T00:00:00.000Z",
    };

    const result = appData.deletePlaythrough(
      asAppData([oldest, newest, active], "c"),
      "c",
    );

    expect(result.activePlaythroughId).toBe("b");
  });

  it("returns the same object until the stored text changes", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(asAppData([emptyPlaythrough()])),
    );

    expect(storageService.load()).toBe(storageService.load());
  });

  it("reads a negative or missing store level as 0 and saves whole numbers of 0 or more", () => {
    const bare = barePlaythrough();

    expect(appData.readStoreLevel(bare)).toBe(0);
    expect(appData.readStoreLevel({ ...bare, storeLevel: -3 })).toBe(0);

    const result = appData.setStoreLevel(asAppData([bare]), bare.id, -2.5, now);
    expect(result.playthroughs[0].storeLevel).toBe(0);
    expect(
      appData.setStoreLevel(asAppData([bare]), bare.id, 12.9, now)
        .playthroughs[0].storeLevel,
    ).toBe(12);
  });

  it("adds an unlock only once and creates a missing list", () => {
    const bare = barePlaythrough();

    const once = appData.addToList(
      asAppData([bare]),
      bare.id,
      "unlockedStorage",
      ["1", "1"],
      now,
    );
    const twice = appData.addToList(
      once,
      bare.id,
      "unlockedStorage",
      ["1", "2"],
      now,
    );

    expect(twice.playthroughs[0].unlockedStorage).toEqual(["1", "2"]);
    expect(twice.playthroughs[0].lastModified).toBe(now.toISOString());
  });

  it("removes every copy of an unlock and keeps the rest in order", () => {
    const playthrough = {
      ...progressedPlaythrough(),
      unlockedGrowth: ["1", "3", "2", "3"],
    };

    const result = appData.removeFromList(
      asAppData([playthrough]),
      playthrough.id,
      "unlockedGrowth",
      ["3"],
      now,
    );

    expect(result.playthroughs[0].unlockedGrowth).toEqual(["1", "2"]);
  });

  it("leaves the data as it is when the playthrough id is unknown", () => {
    const data = asAppData([emptyPlaythrough()]);

    expect(
      appData.addToList(data, "missing", "unlockedTools", ["Bat"], now),
    ).toBe(data);
  });
});
