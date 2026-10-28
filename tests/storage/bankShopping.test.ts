import { describe, expect, it } from "vitest";
import type { AppData } from "@/types/playthrough";
import {
  activateLoan,
  activeLoanEntries,
  loanDetails,
  loanTotals,
  removeLoan,
} from "@/service/bank";
import {
  addableProducts,
  addItems,
  groupByShop,
  listSummary,
  removeItem,
  resetList,
  setBoxes,
  shopName,
  togglePurchased,
} from "@/service/shopping";
import { bank } from "@/data/supermarket-simulator/bank";
import { barePlaythrough, progressedPlaythrough } from "./fixtures";

const now = new Date("2026-04-01T00:00:00.000Z");
const data = (playthrough = barePlaythrough()): AppData => ({
  playthroughs: [playthrough],
  activePlaythroughId: playthrough.id,
});
const first = (appData: AppData) => appData.playthroughs[0];

describe("loans", () => {
  it("computes interest, total and daily payment as before", () => {
    expect(loanDetails(bank.loans[1], 10)).toEqual({
      totalInterest: 400,
      totalPayment: 2400,
      dailyPayment: 240,
    });
    expect(loanDetails(bank.loans[2], 15).dailyPayment).toBeCloseTo(458.33, 2);
  });

  it("ignores entries whose loan no longer exists", () => {
    const playthrough = {
      ...barePlaythrough(),
      activeLoans: [
        {
          loanIndex: 1,
          termLength: 10,
          activatedDate: "2026-03-01T00:00:00.000Z",
        },
        {
          loanIndex: 9,
          termLength: 10,
          activatedDate: "2026-03-01T00:00:00.000Z",
        },
      ],
    };

    expect(activeLoanEntries(playthrough).length).toBe(1);
    expect(loanTotals(playthrough)).toEqual({
      active: 1,
      dailyPayment: 240,
      totalDebt: 2400,
    });
  });

  it("activates once and removes by index", () => {
    const once = activateLoan(data(), barePlaythrough().id, 2, 15, now);
    const twice = activateLoan(once, barePlaythrough().id, 2, 20, now);

    expect(first(twice).activeLoans).toEqual([
      { loanIndex: 2, termLength: 15, activatedDate: now.toISOString() },
    ]);
    expect(
      first(removeLoan(twice, barePlaythrough().id, 2, now)).activeLoans,
    ).toEqual([]);
  });
});

describe("shopping list", () => {
  it("orders shops as the game does, unknown keys before no shop", () => {
    const items = ["", "green_market", "mystery", "deli_and_grocery"].map(
      (store, i) => ({
        id: String(i),
        productName: "x",
        boxes: 1,
        purchased: i === 1,
        store,
      }),
    );

    expect(groupByShop(items).map((group) => group.store)).toEqual([
      "deli_and_grocery",
      "green_market",
      "mystery",
      "",
    ]);
    expect(shopName("deli_and_grocery")).toBe("Deli and Grocery");
    expect(shopName("mystery")).toBe("mystery");
    expect(listSummary(items)).toEqual({ total: 4, bought: 1, boxes: 4 });
  });

  it("adds boxes to an open row with the same product and reads Avacado as Avocado", () => {
    const playthrough = progressedPlaythrough();
    const result = addItems(
      data(playthrough),
      playthrough.id,
      [
        {
          productName: "Avocado",
          company: "Fresh Farms",
          store: "green_market",
          boxes: 3,
        },
        { productName: "Bread", store: "", boxes: 1 },
      ],
      () => "new-id",
      now,
    );

    expect(first(result).shoppingList).toEqual([
      { ...playthrough.shoppingList![0], boxes: 5 },
      playthrough.shoppingList![1],
      {
        id: "new-id",
        productName: "Bread",
        boxes: 1,
        purchased: false,
        store: "",
      },
    ]);
  });

  it("keeps boxes at 1 or more, toggles purchased, removes and resets", () => {
    const playthrough = progressedPlaythrough();
    const id = playthrough.shoppingList![0].id;

    expect(
      first(setBoxes(data(playthrough), playthrough.id, id, 0, now))
        .shoppingList![0].boxes,
    ).toBe(1);
    expect(
      first(togglePurchased(data(playthrough), playthrough.id, id, now))
        .shoppingList![0].purchased,
    ).toBe(true);
    expect(
      first(removeItem(data(playthrough), playthrough.id, id, now))
        .shoppingList!.length,
    ).toBe(1);
    expect(
      first(resetList(data(playthrough), playthrough.id, now)).shoppingList,
    ).toEqual([]);
  });

  it("lists only products from unlocked licenses", () => {
    const products = addableProducts({
      ...barePlaythrough(),
      unlockedLicenses: ["license_0"],
    });

    expect(products.every((product) => product.licenseId === "license_0")).toBe(
      true,
    );
    expect(products.length).toBeGreaterThan(0);
  });
});
