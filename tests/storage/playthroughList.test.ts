import { describe, expect, it } from "vitest";
import {
  filterAndSort,
  licensesUnlocked,
  nextActiveAfterDelete,
  shoppingItemsBought,
} from "@/service/playthroughList";
import { spending } from "@/service/spending";
import { management } from "@/data/supermarket-simulator/management";
import { market } from "@/data/supermarket-simulator/market";
import {
  barePlaythrough,
  emptyPlaythrough,
  playthroughWithUnknownFields,
  progressedPlaythrough,
} from "./fixtures";

const list = () => [
  emptyPlaythrough(),
  progressedPlaythrough(),
  barePlaythrough(),
];

describe("filterAndSort", () => {
  it("searches names without case", () => {
    expect(filterAndSort(list(), "BIG", "name").map((p) => p.name)).toEqual([
      "Big market",
    ]);
  });

  it.each([
    ["lastModified", ["Big market", "Corner shop", "Bare"]],
    ["name", ["Bare", "Big market", "Corner shop"]],
    ["createdAt", ["Big market", "Corner shop", "Bare"]],
    ["storeLevel", ["Big market", "Corner shop", "Bare"]],
  ] as const)("sorts by %s", (sort, names) => {
    expect(filterAndSort(list(), "", sort).map((p) => p.name)).toEqual(names);
  });
});

describe("nextActiveAfterDelete", () => {
  it("picks the most recently updated of the others", () => {
    expect(nextActiveAfterDelete(list(), emptyPlaythrough().id)?.name).toBe(
      "Big market",
    );
    expect(
      nextActiveAfterDelete([emptyPlaythrough()], emptyPlaythrough().id),
    ).toBeNull();
  });
});

describe("card figures", () => {
  it("counts licenses the game data knows", () => {
    expect(licensesUnlocked(playthroughWithUnknownFields())).toEqual({
      owned: 1,
      total: 30,
    });
  });

  it("counts bought shopping list items", () => {
    expect(shoppingItemsBought(progressedPlaythrough())).toEqual({
      bought: 1,
      total: 2,
    });
    expect(shoppingItemsBought(barePlaythrough())).toEqual({
      bought: 0,
      total: 0,
    });
  });

  it("adds up spending as the old Dashboard did", () => {
    const result = spending(progressedPlaythrough());

    expect(result.licenses).toBe(0 + 200 + 400 + 750);
    expect(result.growth).toBe(
      management.growth
        .filter((section) => ["1", "2", "3", "4"].includes(section.sectionNum))
        .reduce((sum, section) => sum + section.price, 0),
    );
    expect(result.tools).toBe(
      market.tools.find((tool) => tool.name === "Crate")!.unitPrice,
    );
    expect(result.total).toBe(result.management + result.market);
    expect(result.management).toBe(
      result.licenses + result.growth + result.storage,
    );
    expect(spending(barePlaythrough()).total).toBe(0);
  });
});
