const plural = (count: number, one: string, other: string) =>
  `${count} ${count === 1 ? one : other}`;

export const marketText = {
  title: "Market",
  tabsLabel: "Market",
  tabs: {
    products: "Products",
    furniture: "Furniture",
    paint: "Paint",
    tools: "Tools",
    vehicles: "Vehicles",
  },
  sublines: {
    products: (name: string) => `${name} · Products your licenses unlock`,
    furniture: (name: string) => `${name} · Furniture prices`,
    paint: (name: string) => `${name} · Paint prices`,
    tools: (name: string) => `${name} · Tools you own`,
    vehicles: (name: string) => `${name} · Vehicles you own`,
  },
  emptyDescription:
    "Pick or create a playthrough to see which products, tools and vehicles you have.",
  free: "Free",
  undoUnlock: "Undo unlock",
  unlock: "Unlock",
  locked: "Locked",
  states: { unlocked: "Unlocked", canUnlock: "Can unlock", locked: "Locked" },
  products: {
    search: "Search by name or company...",
    displayType: "Filter by Display Type",
    allDisplayTypes: "All Display Types",
    category: "Filter by Category",
    allCategories: "All Categories",
    option: (label: string, count: number) => `${label} (${count})`,
    filtersTitle: "Filter products",
    showing: (shown: number, total: number) =>
      `Showing ${shown} of ${total} products`,
    showButton: (count: number) =>
      `Show ${plural(count, "product", "products")}`,
    unlocked: (count: number) => `Unlocked Products (${count})`,
    locked: (count: number) => `Locked Products (${count})`,
    lockedHelp: "Unlock the license in Management to sell these.",
    noUnlocked: "No unlocked products match your filters.",
    noLocked: "No locked products match your filters.",
    requires: (license: string) => `Requires: ${license}`,
    itemsPerBox: "Items per box",
    weightPerBox: "Weight per box",
    kg: (weight: number) => `${weight} kg`,
    boxesPerStorage: "Boxes per storage",
    details: (name: string) => `Details for ${name}`,
    detail: {
      company: "Company",
      displayType: "Display type",
      category: "Category",
      boughtAt: "Bought at",
      license: "License",
      unlocked: (license: string) => `${license}, unlocked`,
      locked: (license: string) => `${license}, not unlocked yet`,
      none: "Not listed",
      toLicenses: "Open Licenses",
      close: "Close",
    },
  },
  furniture: {
    heading: (count: number) => `All Furniture (${count})`,
    note: "Prices from the game. Furniture has no saved state.",
  },
  paint: {
    heading: (count: number) => `All Paint (${count})`,
    note: "Prices from the game. Paint has no saved state.",
  },
  tools: {
    totalSpent: "Total Spent on Tools",
    unlockedOf: (count: number, total: number) =>
      `${count} of ${total} tools unlocked`,
    requiresLicenses: (required: number, owned: number) =>
      `Requires ${required} licenses · you own ${owned}`,
    unlocked: (name: string) => `${name} unlocked`,
    undone: (name: string) => `${name} locked again`,
  },
  vehicles: {
    totalSpent: "Total Spent on Vehicles",
    unlockedOf: (count: number, total: number) =>
      `${count} of ${total} vehicles unlocked`,
    price: "Price",
    storeLevel: "Store level",
    requiresLevel: (level: number, current: number) =>
      `Requires store level ${level} · you are level ${current}`,
    unlocked: (name: string) => `${name} unlocked`,
    undone: (name: string) => `${name} locked again`,
  },
} as const;
