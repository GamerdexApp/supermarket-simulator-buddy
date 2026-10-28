import { describe, expect, it } from "vitest";
import { currentProductName } from "@/service/products";
import { bank } from "@/data/supermarket-simulator/bank";
import { management } from "@/data/supermarket-simulator/management";
import { market } from "@/data/supermarket-simulator/market";
import manifest from "./ids.manifest.json";

const { hiring } = management;

/** Saves store these values, and growth, storage and loans also depend on their order. */
const current: Record<keyof typeof manifest, (string | number)[]> = {
  licenses: management.licenses.map((license) => license.id),
  growth: management.growth.map((section) => section.sectionNum),
  storage: management.storage.map((section) => section.sectionNum),
  employees: [
    ...hiring.cashiers,
    ...hiring.restockers,
    ...hiring.customerHelpers,
    ...hiring.securityGuards,
    ...hiring.janitors,
  ].map((employee) => employee.id),
  tools: market.tools.map((tool) => tool.name),
  vehicles: market.vehicles.map((vehicle) => vehicle.name),
  loans: bank.loans.map((loan) => loan.originalAmount),
  products: market.products.map((product) => product.name),
};

const ordered = ["licenses", "growth", "storage", "loans"] as const;

describe("game data values that saves refer to", () => {
  it.each(ordered)("%s keep their order", (collection) => {
    expect(current[collection].slice(0, manifest[collection].length)).toEqual(
      manifest[collection],
    );
  });

  it.each(["employees", "tools", "vehicles"] as const)(
    "%s keep every id",
    (collection) => {
      const available = new Set(current[collection]);

      expect(manifest[collection].filter((id) => !available.has(id))).toEqual(
        [],
      );
    },
  );

  it("resolves every product name a shopping list may hold", () => {
    const available = new Set(current.products);

    expect(
      manifest.products.filter(
        (name) => !available.has(currentProductName(name)),
      ),
    ).toEqual([]);
  });
});
