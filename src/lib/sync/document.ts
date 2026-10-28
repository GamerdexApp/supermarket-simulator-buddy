import type { AppData, Playthrough } from "@/types/playthrough";
import { parseBackupData } from "@/service/backup";
import { storageService } from "@/service/storage";

/** The data file is the backup file of the app, unchanged. */
export type SyncDocument = AppData;

export const isSyncDocument = (data: unknown): data is SyncDocument =>
  parseBackupData(data).ok;

export const readLocalDocument = (): SyncDocument => storageService.load();

const sameJson = (a: Playthrough[], b: Playthrough[]) =>
  JSON.stringify(a) === JSON.stringify(b);

/**
 * The active playthrough is a choice of each device, so only the playthroughs are applied. When
 * another device deleted the active playthrough, this device has none active and never picks one
 * from the cloud, so the player chooses on the Playthroughs page.
 */
export const applyDocument = (document: SyncDocument): boolean => {
  const current = storageService.load();
  if (sameJson(current.playthroughs, document.playthroughs)) return false;

  const activeStillExists = document.playthroughs.some(
    (playthrough) => playthrough.id === current.activePlaythroughId,
  );
  return storageService.save({
    ...current,
    playthroughs: document.playthroughs,
    activePlaythroughId: activeStillExists ? current.activePlaythroughId : null,
  });
};

export const hasPlaythroughs = (document: SyncDocument) =>
  document.playthroughs.length > 0;
