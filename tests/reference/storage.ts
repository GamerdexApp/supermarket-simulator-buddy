// Frozen copy of the storage code that shipped before the rebuild, with the state changes from the
// old PlaythroughContext. Do not edit it: the new store must keep passing the same contract.
import type { AppData, Playthrough } from "@/types/playthrough";

const STORAGE_KEY = "supermarket-simulator-buddy";

const defaultData: AppData = {
  playthroughs: [],
  activePlaythroughId: null,
};

export const storageService = {
  /**
   * Load data from localStorage
   */
  load(): AppData {
    if (typeof window === "undefined") return defaultData;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return defaultData;

      return JSON.parse(stored) as AppData;
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      return defaultData;
    }
  },

  /**
   * Save data to localStorage
   */
  save(data: AppData): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  },

  /**
   * Export data as JSON string
   */
  exportData(): string {
    const data = this.load();
    return JSON.stringify(data, null, 2);
  },

  /**
   * Import data from JSON string
   */
  importData(jsonString: string): { success: boolean; error?: string } {
    try {
      const data = JSON.parse(jsonString) as AppData;

      // Validate the data structure
      if (!data.playthroughs || !Array.isArray(data.playthroughs)) {
        return {
          success: false,
          error: "Invalid data format: missing playthroughs array",
        };
      }

      this.save(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * Clear all data
   */
  clear(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Add a new playthrough
   */
  addPlaythrough(playthrough: Playthrough): void {
    const data = this.load();
    data.playthroughs.push(playthrough);

    // Set as active if it's the first playthrough
    if (data.playthroughs.length === 1) {
      data.activePlaythroughId = playthrough.id;
    }

    this.save(data);
  },

  /**
   * Update an existing playthrough
   */
  updatePlaythrough(id: string, updates: Partial<Playthrough>): void {
    const data = this.load();
    const index = data.playthroughs.findIndex((p) => p.id === id);

    if (index !== -1) {
      data.playthroughs[index] = {
        ...data.playthroughs[index],
        ...updates,
        lastModified: new Date().toISOString(),
      };
      this.save(data);
    }
  },

  /**
   * Delete a playthrough
   */
  deletePlaythrough(id: string): void {
    const data = this.load();
    data.playthroughs = data.playthroughs.filter((p) => p.id !== id);

    // If the deleted playthrough was active, set a new active one
    if (data.activePlaythroughId === id) {
      data.activePlaythroughId = data.playthroughs[0]?.id || null;
    }

    this.save(data);
  },

  /**
   * Set active playthrough
   */
  setActivePlaythrough(id: string | null): void {
    const data = this.load();
    data.activePlaythroughId = id;
    this.save(data);
  },
};

export const loadAppData = (): AppData => storageService.load();

export const addPlaythrough = (
  prev: AppData,
  playthrough: Omit<Playthrough, "id" | "createdAt" | "lastModified">,
): AppData => {
  const now = new Date().toISOString();
  const newPlaythrough: Playthrough = {
    ...playthrough,
    id: crypto.randomUUID(),
    createdAt: now,
    lastModified: now,
    unlockedLicenses: ["license_0"],
    unlockedGrowth: ["1"],
    unlockedTools: ["Paper Bag", "Sponge", "Mop"],
  };
  const newPlaythroughs = [...prev.playthroughs, newPlaythrough];
  const newActiveId =
    prev.playthroughs.length === 0
      ? newPlaythrough.id
      : prev.activePlaythroughId;
  return { playthroughs: newPlaythroughs, activePlaythroughId: newActiveId };
};

export const updatePlaythrough = (
  prev: AppData,
  id: string,
  updates: Partial<Playthrough>,
): AppData => ({
  ...prev,
  playthroughs: prev.playthroughs.map((p) =>
    p.id === id
      ? { ...p, ...updates, lastModified: new Date().toISOString() }
      : p,
  ),
});

export const deletePlaythrough = (prev: AppData, id: string): AppData => {
  const newPlaythroughs = prev.playthroughs.filter((p) => p.id !== id);
  const newActiveId =
    prev.activePlaythroughId === id
      ? newPlaythroughs[0]?.id || null
      : prev.activePlaythroughId;
  return { playthroughs: newPlaythroughs, activePlaythroughId: newActiveId };
};

export const setActivePlaythrough = (
  prev: AppData,
  id: string | null,
): AppData => ({
  ...prev,
  activePlaythroughId: id,
});
