import type { Playthrough } from "@/types/playthrough";

export const emptyPlaythrough = (): Playthrough => ({
  id: "11111111-1111-4111-8111-111111111111",
  name: "Corner shop",
  createdAt: "2026-01-05T10:00:00.000Z",
  lastModified: "2026-01-05T10:00:00.000Z",
  unlockedLicenses: ["license_0"],
  unlockedGrowth: ["1"],
  unlockedTools: ["Paper Bag", "Sponge", "Mop"],
});

export const progressedPlaythrough = (): Playthrough => ({
  id: "22222222-2222-4222-8222-222222222222",
  name: "Big market",
  description: "Second store, going for every license",
  createdAt: "2026-02-01T09:00:00.000Z",
  lastModified: "2026-03-10T18:30:00.000Z",
  storeLevel: 34,
  activeLoans: [
    { loanIndex: 1, termLength: 20, activatedDate: "2026-03-01T12:00:00.000Z" },
  ],
  unlockedLicenses: ["license_0", "license_1", "license_2", "license_5"],
  unlockedGrowth: ["1", "2", "3", "4"],
  unlockedStorage: ["1", "2"],
  hiredEmployees: ["cashier_1", "restocker_1", "janitor_2"],
  unlockedTools: ["Paper Bag", "Sponge", "Mop", "Crate"],
  unlockedVehicles: ["Skateboard"],
  shoppingList: [
    {
      id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      productName: "Avacado",
      company: "Fresh Farms",
      boxes: 2,
      purchased: false,
      store: "green_market",
    },
    {
      id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      productName: "Bread",
      boxes: 1,
      purchased: true,
      store: "",
    },
  ],
});

/** A save written by a later version, with fields this app does not know. */
export const playthroughWithUnknownFields = (): Playthrough =>
  ({
    ...progressedPlaythrough(),
    id: "33333333-3333-4333-8333-333333333333",
    futureField: { kept: true },
    unlockedLicenses: ["license_0", "license_99"],
  }) as Playthrough;

/** The oldest shape: only the required fields. */
export const barePlaythrough = (): Playthrough => ({
  id: "44444444-4444-4444-8444-444444444444",
  name: "Bare",
  createdAt: "2025-11-01T08:00:00.000Z",
  lastModified: "2025-11-01T08:00:00.000Z",
});

export const completeFixtures = () => [
  emptyPlaythrough(),
  progressedPlaythrough(),
  playthroughWithUnknownFields(),
  barePlaythrough(),
];
