const plural = (count: number, one: string, other: string) =>
  `${count} ${count === 1 ? one : other}`;

export const playthroughsText = {
  title: "Playthroughs",
  subline: (count: number, activeName: string | null) =>
    [
      plural(count, "playthrough", "playthroughs"),
      activeName && `${activeName} is active`,
    ]
      .filter(Boolean)
      .join(" · "),
  newPlaythrough: "New playthrough",
  loading: "Reading saved data from this browser.",
  filters: {
    search: "Search by name",
    sortLabel: "Sort by",
    sort: {
      lastModified: "Last updated",
      name: "Name",
      createdAt: "Date created",
      storeLevel: "Store level",
    },
    showing: (shown: number, total: number) =>
      `Showing ${shown} of ${plural(total, "playthrough", "playthroughs")}`,
    clear: "Clear search",
  },
  empty: {
    title: "No playthroughs yet",
    deletedTitle: "Playthrough deleted",
    description:
      "Create a playthrough to start tracking your store. Everything stays in this browser unless you turn on sync.",
    restore: "Restore from a backup",
  },
  noMatch: {
    title: (query: string) => `No playthroughs match “${query.trim()}”`,
    description: "Try a different name.",
  },
  card: {
    active: "Active",
    setActive: "Set as active",
    openOverview: "Open overview",
    edit: "Edit",
    delete: "Delete",
    created: (date: string) => `Created ${date}`,
    lastModified: (date: string) => `Last updated ${date}`,
    storeLevel: "Store level",
    spending: "Total spending",
    licenses: "Licenses",
    shopping: "Shopping list",
    ofTotal: (count: number, total: number) => `${count} of ${total}`,
    switched: (name: string) => `Switched to ${name}`,
  },
  fields: {
    nameLabel: "Playthrough Name",
    namePlaceholder: "e.g., My First Store",
    nameError: "Enter a name for this playthrough.",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Add a description for this playthrough...",
    cancel: "Cancel",
  },
  create: {
    title: "Create New Playthrough",
    submit: "Create",
    done: (name: string) => `${name} created`,
    starterTitle: "Every new playthrough starts with",
    starter: [
      "Store level 0",
      "License 0, the free starter license",
      "Growth section 1",
      "The Paper Bag, Sponge and Mop tools",
    ],
  },
  edit: {
    title: "Edit Playthrough",
    description: "The fields start from the saved values.",
    save: "Save",
    saved: "Saved",
    savedMessage: (name: string) => `${name} was updated.`,
    dates: (created: string, updated: string) =>
      `Created ${created} · Last updated ${updated}`,
  },
  delete: {
    title: "Delete Playthrough",
    question: (name: string) => `Are you sure you want to delete “${name}”?`,
    description:
      "This removes all saved progress for this playthrough from this device. It also removes it from your other devices at the next sync when sync is on.",
    activeNext: (next: string) =>
      `This is your active playthrough. ${next} becomes active instead.`,
    activeLast:
      "This is your active playthrough and the only one. You will have no active playthrough afterwards.",
    exportFirst: "Export a backup first",
    cancel: "Cancel",
    confirm: "Delete",
    done: (name: string) => `${name} deleted`,
    doneMessage: "Undo within 10 seconds to bring it back.",
    undo: "Undo",
  },
} as const;
