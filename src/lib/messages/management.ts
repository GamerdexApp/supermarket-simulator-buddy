const plural = (count: number, one: string, other: string) =>
  `${count} ${count === 1 ? one : other}`;

const range = (nums: string[]) =>
  nums.length === 1 ? nums[0] : `${nums[0]} to ${nums[nums.length - 1]}`;

export const managementText = {
  title: "Management",
  tabsLabel: "Management",
  tabs: {
    licenses: "Licenses",
    growth: "Growth",
    storage: "Storage",
    hiring: "Hiring",
    customizations: "Customizations",
  },
  sublines: {
    licenses: (name: string) =>
      `${name} · Unlock licenses to sell more products`,
    growth: (name: string) =>
      `${name} · Grow the store floor one section at a time`,
    storage: (name: string) =>
      `${name} · Grow the storage room one section at a time`,
    hiring: (name: string) => `${name} · Hire staff to run the store`,
    customizations: (name: string) =>
      `${name} · Store changes bought in the game`,
  },
  emptyDescription:
    "Pick or create a playthrough to track licenses, store growth, storage and staff.",
  storeLevel: "Store level",
  storeLevelCaption: "Change it in the sidebar",
  free: "Free",
  requiresLevel: (level: number, current: number) =>
    `Requires store level ${level} (you are at ${current})`,
  locked: "Locked",
  undo: "Undo",
  states: { unlocked: "Unlocked", canUnlock: "Can unlock", locked: "Locked" },
  licenses: {
    totalSpent: "Total spent on licenses",
    unlockedOf: (count: number, total: number) =>
      `${count} of ${total} licenses unlocked`,
    canUnlockNow: "Can unlock now",
    lockedByLevel: "Locked by level",
    title: (number: number) => `License ${number}`,
    price: "Price",
    level: "Store level",
    unlocks: (count: number) =>
      `Unlocks ${plural(count, "product", "products")}`,
    unlock: "Unlock license",
    undoUnlock: "Undo unlock",
    unlocked: (number: number) => `License ${number} unlocked`,
    undone: (number: number) => `License ${number} locked again`,
    filters: {
      search: "Search licenses or products",
      title: "Filter licenses",
      show: "Show",
      showOptions: {
        all: "All",
        unlocked: "Unlocked",
        canUnlock: "Can unlock",
        locked: "Locked",
      },
      sort: "Sort by",
      sortOptions: {
        number: "License number",
        price: "Price low to high",
        storeLevel: "Store level low to high",
      },
      summary: (shown: number, total: number) =>
        `Showing ${shown} of ${total} licenses`,
      showButton: (count: number) =>
        `Show ${plural(count, "license", "licenses")}`,
    },
    noMatch: "No licenses match these filters",
    noMatchDescription: "Try another search or show all licenses.",
  },
  sections: {
    growth: {
      totalSpent: "Total spent on growth",
      unlockedOf: (count: number, total: number) =>
        `${count} of ${total} sections unlocked`,
      title: (num: string) => `Growth section ${num}`,
      name: "growth",
      pathLabel: "Growth sections",
    },
    storage: {
      totalSpent: "Total spent on storage",
      unlockedOf: (count: number, total: number) =>
        `${count} of ${total} sections unlocked`,
      title: (num: string) => `Storage section ${num}`,
      name: "storage",
      pathLabel: "Storage sections",
      firstSectionNote:
        "Storage section 1 costs $800 at store level 0 in the game data, while growth section 1 is free.",
    },
    nextSection: "Next section",
    nextSectionValue: (num: string, level: number, price: string) =>
      `Section ${num} · level ${level} · ${price}`,
    allUnlocked: "All unlocked",
    level: (level: number) => `Level ${level}`,
    size: (size: string) => `Size ${size}`,
    nextToUnlock: "Next to unlock",
    unlock: "Unlock",
    undo: "Undo",
    unlockFirst: (num: string) => `Unlock section ${num} first.`,
    unlocked: (kind: string, num: string) => `${kind} section ${num} unlocked`,
    undone: (kind: string, nums: string[]) =>
      nums.length === 1
        ? `${kind} section ${nums[0]} locked again`
        : `${kind} sections ${range(nums)} locked again`,
    cascade: {
      title: (kind: string, num: string) => `Undo ${kind} section ${num}?`,
      body: (nums: string[], price: string) =>
        `Sections ${range(nums.slice(1))} need it and lock with it. Total spent drops by ${price}.`,
      confirm: (nums: string[]) => `Undo sections ${range(nums)}`,
      keep: "Keep them unlocked",
    },
  },
  hiring: {
    dailyWages: "Total daily wages",
    dailyWagesCaption: "Combined daily cost for all hired employees",
    hired: "Employees hired",
    hiringCosts: "Hiring costs paid",
    hiringCostsCaption: "One time, not part of daily wages",
    roles: {
      cashiers: {
        title: "Cashiers",
        one: "Cashier",
        stat: "Complete checkout",
      },
      restockers: {
        title: "Restockers",
        one: "Restocker",
        stat: "Number of racks",
      },
      customerHelpers: {
        title: "Customer helpers",
        one: "Customer helper",
        stat: "Number of checkouts",
      },
      securityGuards: {
        title: "Security guards",
        one: "Security guard",
        stat: "",
      },
      janitors: { title: "Janitors", one: "Janitor", stat: "" },
    },
    hiredOf: (count: number, total: number) => `Hired ${count} of ${total}`,
    roleWages: (amount: string) => `Daily wages: ${amount}`,
    hiredBadge: "Hired",
    level: "Store level",
    cost: "Hiring cost",
    wage: "Daily wage",
    perDay: (amount: string) => `${amount} / day`,
    hire: "Hire",
    fire: "Fire",
    hiredToast: (name: string) => `${name} hired`,
    firedToast: (name: string) => `${name} fired`,
  },
  customizations: {
    total: "Price of all three",
    totalCaption: "Derived from the game data, not saved",
    note: "These changes are bought in the game. Nothing is saved here.",
    price: "Price",
  },
} as const;
