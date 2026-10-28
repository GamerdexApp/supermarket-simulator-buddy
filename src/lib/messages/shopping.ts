const plural = (count: number, one: string, other: string) =>
  `${count} ${count === 1 ? one : other}`;

export const shoppingText = {
  title: "Shopping List",
  subline: (name: string) => `Plan your product purchases for ${name}`,
  emptyDescription: "Create a playthrough to plan purchases.",
  addProducts: "Add Products",
  summary: {
    title: "Shopping Summary",
    purchased: (bought: number, total: number) =>
      `${bought} / ${total} items purchased`,
    boxes: (count: number) => `${count} total boxes`,
    reset: "Reset List",
  },
  reset: {
    title: "Reset the shopping list?",
    body: (items: number, bought: number, boxes: number) =>
      `This removes ${plural(items, "item", "items")} (${bought} purchased, ${plural(boxes, "box", "boxes")}).`,
    cancel: "Cancel",
    confirm: "Reset list",
    done: "Shopping list reset",
    doneMessage: (items: number) =>
      `${plural(items, "item", "items")} removed.`,
  },
  empty: {
    title: "Your shopping list is empty",
    body: "Plan which products to buy before your next trip to the shops.",
    steps: [
      "Add products from the licenses you have unlocked.",
      "Tap a product again to add another box.",
      "Tick items off as you buy them.",
    ],
    missing: "Missing a product? Unlock its license in Management.",
    toManagement: "Open Licenses",
  },
  shop: {
    items: (count: number) => plural(count, "item", "items"),
    progress: (bought: number, total: number, boxes: number) =>
      `${bought} of ${total} bought · ${plural(boxes, "box", "boxes")}`,
  },
  row: {
    purchased: (label: string) => `Mark purchased: ${label}`,
    boxes: "Boxes",
    remove: (label: string) => `Remove ${label}`,
    removed: (name: string) => `Removed ${name}`,
  },
  undo: "Undo",
  dialog: {
    title: "Add Products to Shopping List",
    search: "Search Products",
    searchPlaceholder: "Search by name or company...",
    source: "Only products from unlocked licenses are listed.",
    showing: (shown: number, total: number) => `Showing ${shown} of ${total}`,
    pick: "Click a Product to Add",
    noResults: (term: string) => `No products found matching "${term}"`,
    noResultsHint:
      "A missing product may need a license you have not unlocked yet.",
    clearSearch: "Clear search",
    addOne: (label: string) => `Add one box of ${label}`,
    pending: (count: number) => `Items to Add (${count})`,
    noPending:
      "No items added yet. Tap a product on the left to add one box. Tap it again for more.",
    merges: "A product already on your list gets these boxes added to its row.",
    boxes: (count: number) => plural(count, "box", "boxes"),
    removePending: (label: string) => `Remove ${label} from items to add`,
    cancel: "Cancel",
    submit: (count: number) => `Add ${plural(count, "Item", "Items")} to List`,
    added: (count: number) => `${plural(count, "item", "items")} added`,
  },
} as const;
