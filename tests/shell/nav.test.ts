import { describe, expect, it } from "vitest";
import { navCount, unlockedProductCount } from "@/service/navCounts";
import { getPageTitle } from "@/data/nav";
import { market } from "@/data/supermarket-simulator/market";
import { barePlaythrough, progressedPlaythrough } from "../storage/fixtures";

describe("sidebar counts", () => {
  it("counts the products that the unlocked licenses allow", () => {
    const playthrough = {
      ...barePlaythrough(),
      unlockedLicenses: ["license_0"],
    };
    const expected = market.products.filter(
      (p) => p.licenseId === "license_0",
    ).length;

    expect(unlockedProductCount(playthrough)).toBe(expected);
    expect(navCount("market", barePlaythrough())).toBe(0);
  });

  it("counts open shopping list items and hides the count when none are open", () => {
    expect(navCount("shoppingList", progressedPlaythrough())).toBe(1);
    expect(navCount("shoppingList", barePlaythrough())).toBeNull();
  });

  it("shows no count on other links", () => {
    expect(navCount("bank", progressedPlaythrough())).toBeNull();
  });
});

describe("page titles", () => {
  it.each([
    ["/overview", "Overview"],
    ["/market", "Market"],
    ["/shopping-list", "Shopping list"],
    ["/settings", "Settings"],
    ["/playthroughs", "Playthroughs"],
    ["/unknown", "Supermarket Simulator Buddy"],
  ])("%s is titled %s", (path, title) => {
    expect(getPageTitle(path)).toBe(title);
  });
});
