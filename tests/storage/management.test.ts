import { describe, expect, it } from "vitest";
import {
  allEmployees,
  countKnown,
  customizationsTotal,
  employeeNumber,
  filterLicenses,
  hiringTotals,
  licenseProducts,
  licenseState,
  priceOfSections,
  productLabel,
  roles,
  sectionPath,
  sectionsToLock,
} from "@/service/management";
import { management } from "@/data/supermarket-simulator/management";
import { barePlaythrough, playthroughWithUnknownFields } from "./fixtures";

const at = (storeLevel: number, extra = {}) => ({
  ...barePlaythrough(),
  storeLevel,
  ...extra,
});

describe("licenses", () => {
  const license = (n: number) => management.licenses[n];

  it("is unlocked, can unlock or locked by the store level only", () => {
    const playthrough = at(12, { unlockedLicenses: ["license_1"] });

    expect(licenseState(license(1), playthrough)).toBe("unlocked");
    expect(licenseState(license(5), playthrough)).toBe("canUnlock");
    expect(licenseState(license(8), playthrough)).toBe("locked");
  });

  it("lists its products as Company - Name", () => {
    const labels = licenseProducts(license(0)).map(productLabel);

    expect(labels.length).toBeGreaterThan(0);
    expect(labels.every((label) => !label.startsWith(" - "))).toBe(true);
  });

  it("filters by state, searches licenses and products, and sorts", () => {
    const playthrough = at(12, { unlockedLicenses: ["license_0"] });
    const ids = (
      show: "all" | "unlocked" | "canUnlock" | "locked",
      search = "",
      sort: "number" | "price" | "storeLevel" = "number",
    ) => filterLicenses(playthrough, { show, search, sort }).map((l) => l.id);

    expect(ids("unlocked")).toEqual(["license_0"]);
    expect(ids("canUnlock")).toEqual([
      "license_1",
      "license_2",
      "license_3",
      "license_4",
      "license_5",
      "license_6",
      "license_7",
    ]);
    expect(ids("all", "license 12")).toEqual(["license_12"]);
    expect(ids("all", "butter")).toContain("license_8");
    expect(ids("all", "", "price")[0]).toBe("license_0");
    expect(ids("all").length).toBe(30);
  });

  it("counts only ids the game data knows", () => {
    expect(
      countKnown(
        playthroughWithUnknownFields().unlockedLicenses,
        management.licenses.map((l) => l.id),
      ),
    ).toBe(1);
  });
});

describe("growth and storage path", () => {
  it("marks the first locked section as next when its level is reached", () => {
    const steps = sectionPath(
      "growth",
      at(10, { unlockedGrowth: ["1", "2", "3"] }),
    );

    expect(
      steps.filter((s) => s.isNext).map((s) => s.section.sectionNum),
    ).toEqual(["4"]);
    expect(steps[4]).toMatchObject({ needsSection: "4", needsLevel: 14 });
  });

  it("has no next section when the level is too low", () => {
    const steps = sectionPath("growth", at(3, { unlockedGrowth: ["1"] }));

    expect(steps.some((s) => s.isNext)).toBe(false);
    expect(steps[1]).toMatchObject({ needsSection: null, needsLevel: 4 });
  });

  it("locks every later unlocked section with an undo", () => {
    const playthrough = at(40, {
      unlockedGrowth: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    });

    expect(sectionsToLock("growth", playthrough, "5")).toEqual([
      "5",
      "6",
      "7",
      "8",
      "9",
    ]);
    expect(sectionsToLock("growth", playthrough, "9")).toEqual(["9"]);
    expect(priceOfSections("growth", ["1", "2"])).toBe(350);
  });

  it("reads the section size from the game data", () => {
    expect(sectionPath("storage", at(0))[0].section.size).toBe("4x4");
  });
});

describe("hiring", () => {
  it("drives five roles with 23 employees", () => {
    expect(roles.map((role) => role.employees.length)).toEqual([6, 6, 6, 2, 3]);
    expect(allEmployees.length).toBe(23);
    expect(employeeNumber(roles[2].employees[3])).toBe(4);
  });

  it("adds wages and hiring costs over hired ids only", () => {
    const totals = hiringTotals(
      allEmployees,
      at(30, { hiredEmployees: ["cashier_1", "janitor_2", "ghost_1"] }),
    );

    expect(totals).toEqual({
      hired: 2,
      total: 23,
      dailyWages: 160,
      hiringCosts: 300,
    });
  });
});

describe("customizations", () => {
  it("adds the three prices", () => {
    expect(customizationsTotal).toBe(1700);
  });
});
