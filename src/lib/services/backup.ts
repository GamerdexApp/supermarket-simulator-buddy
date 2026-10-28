import type { AppData, Playthrough } from "@/types/playthrough";

type ParseResult = { ok: true; data: AppData } | { ok: false; error: string };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim() !== "";

const hasIdAndName = (value: unknown): value is Playthrough =>
  isRecord(value) &&
  isNonEmptyString(value.id) &&
  typeof value.name === "string";

const withValidStoreLevel = (playthrough: Playthrough): Playthrough =>
  typeof playthrough.storeLevel === "number" && playthrough.storeLevel < 0
    ? { ...playthrough, storeLevel: 0 }
    : playthrough;

const rejected = (reason: string): ParseResult => ({
  ok: false,
  error: `${reason} Nothing was changed.`,
});

/**
 * Checks the content of a backup file. Nothing is saved by this function. Entries without an id or
 * a name are skipped, a repeated id keeps its first entry, and a negative store level becomes 0.
 * Unknown fields are kept so a file from a later version loads unchanged. A file that the old app
 * wrote always passes.
 */
export const parseBackupData = (raw: unknown): ParseResult => {
  if (!isRecord(raw) || !Array.isArray(raw.playthroughs)) {
    return rejected("The file has no list of playthroughs.");
  }

  const seen = new Set<string>();
  const playthroughs = raw.playthroughs
    .filter(hasIdAndName)
    .filter((playthrough) => {
      if (seen.has(playthrough.id)) return false;
      seen.add(playthrough.id);
      return true;
    })
    .map(withValidStoreLevel);

  const requestedActive =
    typeof raw.activePlaythroughId === "string"
      ? raw.activePlaythroughId
      : null;
  const activePlaythroughId = seen.has(requestedActive ?? "")
    ? requestedActive
    : (playthroughs[0]?.id ?? null);

  return { ok: true, data: { ...raw, playthroughs, activePlaythroughId } };
};

/** Checks the text of a backup file. */
export const parseBackup = (text: string): ParseResult => {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return rejected("The file is not valid JSON.");
  }
  return parseBackupData(raw);
};

export type ImportMode = "merge" | "replace";

export type ImportRowResult =
  "added" | "updated" | "kept" | "replaced" | "removed";

export interface ImportRow {
  name: string;
  fileModified?: string;
  deviceModified?: string;
  result: ImportRowResult;
}

export const planImport = (
  current: AppData,
  incoming: AppData,
  mode: ImportMode,
): ImportRow[] => {
  const onDevice = new Map(current.playthroughs.map((p) => [p.id, p]));

  const rows: ImportRow[] = incoming.playthroughs.map((playthrough) => {
    const existing = onDevice.get(playthrough.id);
    const base = {
      name: playthrough.name,
      fileModified: playthrough.lastModified,
    };
    if (mode === "replace") {
      return {
        ...base,
        deviceModified: existing?.lastModified,
        result: "replaced",
      };
    }
    if (!existing) return { ...base, result: "added" };
    const fileIsNewer = playthrough.lastModified > existing.lastModified;
    return {
      ...base,
      deviceModified: existing.lastModified,
      result: fileIsNewer ? "updated" : "kept",
    };
  });

  const incomingIds = new Set(incoming.playthroughs.map((p) => p.id));
  current.playthroughs
    .filter((playthrough) => !incomingIds.has(playthrough.id))
    .forEach((playthrough) =>
      rows.push({
        name: playthrough.name,
        deviceModified: playthrough.lastModified,
        result: mode === "replace" ? "removed" : "kept",
      }),
    );
  return rows;
};

/**
 * Replace keeps the file as it is. Merge adds playthroughs with new ids and, for a matching id,
 * keeps the copy with the later `lastModified`. The active playthrough on this device stays active.
 */
export const applyImport = (
  current: AppData,
  incoming: AppData,
  mode: ImportMode,
): AppData => {
  if (mode === "replace") return incoming;

  const incomingById = new Map(incoming.playthroughs.map((p) => [p.id, p]));
  const merged = current.playthroughs.map((playthrough) => {
    const fromFile = incomingById.get(playthrough.id);
    return fromFile && fromFile.lastModified > playthrough.lastModified
      ? fromFile
      : playthrough;
  });
  const knownIds = new Set(current.playthroughs.map((p) => p.id));
  const added = incoming.playthroughs.filter((p) => !knownIds.has(p.id));
  const playthroughs = [...merged, ...added];

  const activeStillExists = playthroughs.some(
    (p) => p.id === current.activePlaythroughId,
  );

  return {
    ...incoming,
    ...current,
    playthroughs,
    activePlaythroughId: activeStillExists
      ? current.activePlaythroughId
      : (playthroughs[0]?.id ?? null),
  };
};

export const summarizeImport = (rows: ImportRow[]): string =>
  (["added", "updated", "kept", "replaced", "removed"] as ImportRowResult[])
    .map((result) => ({
      result,
      amount: rows.filter((row) => row.result === result).length,
    }))
    .filter(({ amount }) => amount > 0)
    .map(({ result, amount }) => `${amount} ${result}`)
    .join(", ");

/** The old app named backups by the UTC date. */
export const backupFileName = (date = new Date()) =>
  `supermarket-simulator-backup-${date.toISOString().split("T")[0]}.json`;

export const backupText = (data: AppData) => JSON.stringify(data, null, 2);

export const downloadBackup = (data: AppData): string => {
  const fileName = backupFileName();
  const blob = new Blob([backupText(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return fileName;
};
