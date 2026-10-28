import { describe, expect, it } from "vitest";
import type { AppData } from "@/types/playthrough";
import {
  applyImport,
  backupFileName,
  parseBackup,
  planImport,
  summarizeImport,
} from "@/service/backup";
import {
  completeFixtures,
  emptyPlaythrough,
  playthroughWithUnknownFields,
  progressedPlaythrough,
} from "./fixtures";

const file = (data: unknown) => JSON.stringify(data);

const asAppData = (
  playthroughs: AppData["playthroughs"],
  active: string | null = null,
): AppData => ({ playthroughs, activePlaythroughId: active });

describe("parseBackup", () => {
  it("accepts a file the old app wrote", () => {
    const saved = asAppData(completeFixtures(), progressedPlaythrough().id);

    expect(parseBackup(JSON.stringify(saved, null, 2))).toEqual({
      ok: true,
      data: saved,
      stats: { read: 4, skipped: 0, levelsFixed: 0 },
    });
  });

  it("keeps unknown fields at every level", () => {
    const fixture = playthroughWithUnknownFields();
    const saved = { ...asAppData([fixture], fixture.id), futureTop: 1 };

    const result = parseBackup(file(saved));

    expect(result.ok && result.data).toEqual(saved);
  });

  it("skips entries without an id or a name and keeps the first of a repeated id", () => {
    const kept = emptyPlaythrough();
    const saved = {
      playthroughs: [
        kept,
        { ...kept, name: "Duplicate" },
        { name: "No id" },
        { id: "no-name" },
        "not an object",
      ],
      activePlaythroughId: null,
    };

    const result = parseBackup(file(saved));

    expect(result.ok && result.data.playthroughs).toEqual([kept]);
    expect(result.ok && result.stats).toEqual({
      read: 5,
      skipped: 4,
      levelsFixed: 0,
    });
  });

  it("writes a negative store level as 0", () => {
    const below = { ...progressedPlaythrough(), storeLevel: -4 };

    const result = parseBackup(file(asAppData([below])));

    expect(result.ok && result.data.playthroughs[0].storeLevel).toBe(0);
    expect(result.ok && result.stats.levelsFixed).toBe(1);
  });

  it("keeps the file's active playthrough when it exists, otherwise picks the first", () => {
    const first = emptyPlaythrough();
    const second = progressedPlaythrough();

    const known = parseBackup(file(asAppData([first, second], second.id)));
    const unknown = parseBackup(file(asAppData([first, second], "gone")));

    expect(known.ok && known.data.activePlaythroughId).toBe(second.id);
    expect(unknown.ok && unknown.data.activePlaythroughId).toBe(first.id);
  });

  it.each([
    ["text that is not JSON", "not json"],
    ["a file without a playthroughs list", file({ hello: "world" })],
    ["a list that is not an array", file({ playthroughs: {} })],
  ])("rejects %s", (_label, text) => {
    const result = parseBackup(text);

    expect(result.ok).toBe(false);
    expect(!result.ok && result.error).toMatch(/Nothing was changed\.$/);
  });
});

describe("applyImport", () => {
  const onDevice = {
    ...progressedPlaythrough(),
    lastModified: "2026-03-10T00:00:00.000Z",
  };

  it("replaces everything in replace mode", () => {
    const incoming = asAppData([emptyPlaythrough()], emptyPlaythrough().id);

    expect(
      applyImport(asAppData([onDevice], onDevice.id), incoming, "replace"),
    ).toEqual(incoming);
  });

  it("adds new playthroughs and keeps the later copy of a matching id in merge mode", () => {
    const newerInFile = {
      ...onDevice,
      name: "From file",
      lastModified: "2026-04-01T00:00:00.000Z",
    };
    const added = emptyPlaythrough();

    const result = applyImport(
      asAppData([onDevice], onDevice.id),
      asAppData([newerInFile, added], added.id),
      "merge",
    );

    expect(result.playthroughs).toEqual([newerInFile, added]);
    expect(result.activePlaythroughId).toBe(onDevice.id);
  });

  it("keeps the device copy when it is newer in merge mode", () => {
    const olderInFile = {
      ...onDevice,
      name: "Old",
      lastModified: "2026-01-01T00:00:00.000Z",
    };

    const result = applyImport(
      asAppData([onDevice]),
      asAppData([olderInFile]),
      "merge",
    );

    expect(result.playthroughs).toEqual([onDevice]);
  });
});

describe("planImport", () => {
  it("lists what each mode does to each playthrough", () => {
    const device = asAppData([progressedPlaythrough()]);
    const incoming = asAppData([emptyPlaythrough()]);

    expect(summarizeImport(planImport(device, incoming, "merge"))).toBe(
      "1 added, 1 kept",
    );
    expect(summarizeImport(planImport(device, incoming, "replace"))).toBe(
      "1 replaced, 1 removed",
    );
  });
});

describe("backupFileName", () => {
  it("uses the old name with the UTC date", () => {
    expect(backupFileName(new Date("2026-10-28T23:30:00.000Z"))).toBe(
      "supermarket-simulator-backup-2026-10-28.json",
    );
  });
});
