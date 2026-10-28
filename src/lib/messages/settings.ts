const plural = (count: number, one: string, other: string) =>
  `${count} ${count === 1 ? one : other}`;

export const settingsText = {
  title: "Settings",
  subline: "Manage your data and application settings",
  tabsLabel: "Settings",
  tabs: {
    sync: "Cloud sync",
    preferences: "Preferences",
    data: "Backup and data",
    about: "About",
  },
  playthroughCount: (count: number) =>
    plural(count, "Playthrough", "Playthroughs"),
  storageNote: {
    title: "Data Storage!",
    body: "Your data is stored locally in the browser. Data is lost when the browser cache is cleared. Please use the functions below to export and backup your data.",
  },
  data: {
    title: "Data Management",
    export: {
      title: "Export Data",
      button: "Export All Playthroughs",
      description: "Download a backup file of all your saved playthroughs.",
      done: "Backup downloaded",
    },
    import: {
      title: "Import Data",
      description: "Upload a previously exported file (.json)",
      fileLabel: "Backup file",
      chooseFile: "Choose file",
      noFile: "No file chosen",
      review: "Review import",
      merged: "Import merged",
      replaced: "Data replaced",
      undo: "Undo",
    },
    reset: {
      title: "Reset All Data",
      warning:
        "This deletes every playthrough on this device. You can undo it for 10 seconds afterwards.",
      button: "Reset all data",
      confirmTitle: "Reset all data?",
      confirmBody: (names: string) => `This deletes ${names}.`,
      cancel: "Cancel",
      confirm: "Yes, reset all data",
      syncedCopy: (provider: string) =>
        `Also delete the synced copy in ${provider}`,
      syncedOn:
        "Sync stays on. Your other devices lose these playthroughs at their next sync. Export a backup first if you are not sure.",
      syncDisconnected: " Sync is disconnected on this browser.",
      done: "All data reset",
      doneMessage: (count: number) =>
        `${plural(count, "playthrough", "playthroughs")} deleted.`,
      undo: "Undo",
    },
  },
  appearance: {
    title: "Appearance",
    description:
      "Choose how the app looks. The choice is saved on this device only and is not part of a backup.",
    themeLabel: "Theme",
    themes: { light: "Light", dark: "Dark", system: "System" },
    themeNote: (current: string) =>
      `System follows your device. Your device is set to ${current} right now.`,
  },
  playthroughs: {
    title: "Playthroughs",
    description:
      "Create, switch, edit and delete playthroughs on the Playthroughs page.",
    manage: "Manage playthroughs",
  },
  about: {
    version: (version: string) => `Version ${version}`,
    summary:
      "A progress tracking tool for Supermarket Simulator. All data is stored locally in your browser.",
    officialGame: "Official game",
    disclaimer:
      "Not affiliated with, endorsed by, or connected to Supermarket Simulator or its developers. All trademarks and game content belong to their owners.",
  },
  importDialog: {
    title: "Import a backup",
    fileInfo: (name: string, size: string) => `${name} · ${size}`,
    bytes: (count: number) => `${count} B`,
    kilobytes: (count: number) => `${count} KB`,
    failedTitle: "Import failed",
    checksTitle: "File checked",
    checks: (
      read: number,
      kept: number,
      skipped: number,
      levelsFixed: number,
    ) =>
      [
        `${plural(read, "entry", "entries")} read, ${kept} with an id and a name.`,
        skipped > 0 && `${plural(skipped, "entry", "entries")} skipped.`,
        levelsFixed > 0 &&
          `${plural(levelsFixed, "store level", "store levels")} below 0 will be saved as 0.`,
      ]
        .filter(Boolean)
        .join(" "),
    howToApply: "How should the file be applied?",
    modeLabel: "Import mode",
    modes: {
      merge: "Merge into this device (recommended)",
      replace: "Replace everything",
    },
    modeNotes: {
      merge:
        "Adds playthroughs that are new. For a playthrough on both, the copy updated last wins. Playthroughs only on this device stay. Your active playthrough stays active.",
      replace:
        "Deletes the playthroughs on this device and keeps only the file. The file's active playthrough becomes active.",
    },
    whatChanges: "What changes",
    columns: {
      playthrough: "Playthrough",
      inFile: "In file",
      onDevice: "On device",
      result: "Result",
    },
    results: {
      added: "Added",
      updated: "Updated from file",
      kept: "Kept",
      replaced: "From file",
      removed: "Removed",
    },
    notThere: "Not there",
    noPlaythroughs: "The file has no playthroughs.",
    undoNote: "You can undo the import for 10 seconds afterwards.",
    cancel: "Cancel",
    close: "Close",
    merge: "Merge",
    replace: "Replace everything",
  },
} as const;
