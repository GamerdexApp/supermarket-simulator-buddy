import { describe, expect, it } from "vitest";
import {
  ALL,
  categoryOptions,
  displayTypeOptions,
  filterProducts,
  labelOf,
  productKey,
  toolState,
  vehicleState,
} from "@/service/market";
import { market } from "@/data/supermarket-simulator/market";
import { barePlaythrough } from "./fixtures";

const at = (extra = {}) => ({ ...barePlaythrough(), ...extra });
const tool = (name: string) => market.tools.find((t) => t.name === name)!;
const vehicle = (name: string) => market.vehicles.find((v) => v.name === name)!;

describe("products", () => {
  it("searches name or company without case and combines the filters", () => {
    const all = { search: "", displayType: ALL, category: ALL };

    expect(filterProducts(market.products, all).length).toBe(186);
    expect(
      filterProducts(market.products, { ...all, search: "AVOCADO" }).map(
        (p) => p.name,
      ),
    ).toEqual(["Avocado"]);
    expect(
      filterProducts(market.products, { ...all, search: "bio juice" }).every(
        (p) => p.company === "Bio Juice",
      ),
    ).toBe(true);
    expect(
      filterProducts(market.products, {
        ...all,
        displayType: "freezer",
        category: "drink",
      }).length,
    ).toBe(0);
  });

  it("offers only values that products use, with their counts", () => {
    expect(displayTypeOptions.map((o) => o.id)).not.toContain("pegboard");
    expect(categoryOptions.map((o) => o.id)).not.toContain("kitchen");
    expect(displayTypeOptions.reduce((sum, o) => sum + o.count, 0)).toBe(186);
  });

  it("keys every product uniquely", () => {
    expect(new Set(market.products.map(productKey)).size).toBe(186);
  });

  it("labels stored values as the old cards did", () => {
    expect(labelOf("garment_rack")).toBe("Garment Rack");
  });
});

describe("tools", () => {
  it("needs 3 owned licenses for the Tablet", () => {
    expect(
      toolState(
        tool("Tablet"),
        at({ unlockedLicenses: ["license_0", "license_1"] }),
      ),
    ).toBe("locked");
    expect(
      toolState(
        tool("Tablet"),
        at({ unlockedLicenses: ["license_0", "license_1", "license_99"] }),
      ),
    ).toBe("locked");
    expect(
      toolState(
        tool("Tablet"),
        at({ unlockedLicenses: ["license_0", "license_1", "license_2"] }),
      ),
    ).toBe("canUnlock");
    expect(toolState(tool("Bat"), at())).toBe("canUnlock");
    expect(toolState(tool("Mop"), at({ unlockedTools: ["Mop"] }))).toBe(
      "unlocked",
    );
  });
});

describe("vehicles", () => {
  it("are gated by the store level", () => {
    const sedan = vehicle("Sedan");

    expect(vehicleState(sedan, at({ storeLevel: sedan.storeLevel - 1 }))).toBe(
      "locked",
    );
    expect(vehicleState(sedan, at({ storeLevel: sedan.storeLevel }))).toBe(
      "canUnlock",
    );
  });
});

describe("furniture", () => {
  it("names the double freezer", () => {
    expect(market.furnitures.map((f) => f.name)).toContain("Freezer Double");
  });
});
