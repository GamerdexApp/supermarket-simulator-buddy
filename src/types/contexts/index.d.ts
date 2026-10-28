import { AppData, Playthrough } from "@/types";
import type { NewPlaythrough } from "@/service/appData";
import type { ImportMode } from "@/service/backup";

export interface PlaythroughContextType {
  appData: AppData;
  playthroughs: Playthrough[];
  activePlaythrough: Playthrough | null;
  /** False until the saved data has been read in the browser. Nothing is saved before that. */
  isLoaded: boolean;
  lastSavedAt: Date | null;
  saveFailed: boolean;
  /** Saves `update(current)` and returns the data from before the change for Undo, or null when the save failed. */
  updateData: (update: (current: AppData) => AppData) => AppData | null;
  setActivePlaythrough: (id: string | null) => void;
  /** Returns the id of the new playthrough, which becomes the active one, or null when the save failed. */
  addPlaythrough: (playthrough: NewPlaythrough) => string | null;
  updatePlaythrough: (id: string, updates: Partial<Playthrough>) => void;
  deletePlaythrough: (id: string) => AppData | null;
  importData: (
    jsonString: string,
    mode?: ImportMode,
  ) => { success: boolean; error?: string };
  exportData: () => string;
  /** Removes the saved data and returns it for Undo. */
  clearAllData: () => AppData;
}

export interface UIContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}
