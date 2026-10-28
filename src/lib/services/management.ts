import type { Growth, License, Product, Storage } from "@/types";
import type { Playthrough } from "@/types/playthrough";
import { management } from "@/data/supermarket-simulator/management";
import { market } from "@/data/supermarket-simulator/market";
import { readStoreLevel } from "./appData";

/** Counts only ids that the game data knows. Unknown ids stay in storage untouched. */
export const countKnown = (ids: string[] | undefined, known: string[]) => {
  const owned = new Set(ids ?? []);
  return known.filter((id) => owned.has(id)).length;
};

export type UnlockState = "unlocked" | "canUnlock" | "locked";

export const licenseNumber = (license: License) =>
  Number(license.id.replace("license_", ""));

export const licenseState = (
  license: License,
  playthrough: Playthrough,
): UnlockState => {
  if ((playthrough.unlockedLicenses ?? []).includes(license.id))
    return "unlocked";
  return readStoreLevel(playthrough) >= license.storeLevel
    ? "canUnlock"
    : "locked";
};

const productsByLicense = market.products.reduce<Map<string, Product[]>>(
  (byLicense, product) => {
    byLicense.set(product.licenseId, [
      ...(byLicense.get(product.licenseId) ?? []),
      product,
    ]);
    return byLicense;
  },
  new Map(),
);

export const licenseProducts = (license: License): Product[] =>
  productsByLicense.get(license.id) ?? [];

/** "Company - Name", or the name alone when the product has no company, as the old cards showed it. */
export const productLabel = (product: Product) =>
  product.company ? `${product.company} - ${product.name}` : product.name;

export type LicenseShow = "all" | UnlockState;
export type LicenseSort = "number" | "price" | "storeLevel";

const LICENSE_SORTERS: Record<LicenseSort, (a: License, b: License) => number> =
  {
    number: (a, b) => licenseNumber(a) - licenseNumber(b),
    price: (a, b) => a.price - b.price || licenseNumber(a) - licenseNumber(b),
    storeLevel: (a, b) =>
      a.storeLevel - b.storeLevel || licenseNumber(a) - licenseNumber(b),
  };

export const filterLicenses = (
  playthrough: Playthrough,
  {
    show,
    search,
    sort,
  }: { show: LicenseShow; search: string; sort: LicenseSort },
): License[] => {
  const needle = search.trim().toLowerCase();
  const matches = (license: License) =>
    needle === "" ||
    `license ${licenseNumber(license)}`.includes(needle) ||
    licenseProducts(license).some((product) =>
      productLabel(product).toLowerCase().includes(needle),
    );
  return management.licenses
    .filter(
      (license) =>
        show === "all" || licenseState(license, playthrough) === show,
    )
    .filter(matches)
    .sort(LICENSE_SORTERS[sort]);
};

export type SectionKind = "growth" | "storage";
type Section = Growth | Storage;

export const sectionsOf = (kind: SectionKind): Section[] =>
  kind === "growth" ? management.growth : management.storage;

export const sectionField = (kind: SectionKind) =>
  kind === "growth" ? "unlockedGrowth" : "unlockedStorage";

export interface SectionStep {
  section: Section;
  unlocked: boolean;
  /** The one section that can be unlocked now, when both rules pass. */
  isNext: boolean;
  /** The section before this one, when it is still locked. */
  needsSection: string | null;
  /** The store level this section needs, when the playthrough is below it. */
  needsLevel: number | null;
}

/**
 * A section needs the one before it in the list and its store level, as in the old app. The list
 * order is the unlock order.
 */
export const sectionPath = (
  kind: SectionKind,
  playthrough: Playthrough,
): SectionStep[] => {
  const owned = new Set(playthrough[sectionField(kind)] ?? []);
  const level = readStoreLevel(playthrough);
  const sections = sectionsOf(kind);
  let nextFound = false;
  return sections.map((section, index) => {
    const unlocked = owned.has(section.sectionNum);
    const previous = sections[index - 1];
    const needsSection =
      previous && !owned.has(previous.sectionNum) ? previous.sectionNum : null;
    const needsLevel = level < section.storeLevel ? section.storeLevel : null;
    const isNext =
      !unlocked && !nextFound && needsSection === null && needsLevel === null;
    if (!unlocked && !nextFound) nextFound = true;
    return { section, unlocked, isNext, needsSection, needsLevel };
  });
};

/** The first section that is not unlocked yet, whether or not it can be unlocked now. */
export const nextSection = (kind: SectionKind, playthrough: Playthrough) =>
  sectionPath(kind, playthrough).find((step) => !step.unlocked) ?? null;

/**
 * Undoing a section also locks every later unlocked section, because each one needs the section
 * before it. Returns the section numbers to remove, starting with `sectionNum`.
 */
export const sectionsToLock = (
  kind: SectionKind,
  playthrough: Playthrough,
  sectionNum: string,
): string[] => {
  const owned = new Set(playthrough[sectionField(kind)] ?? []);
  const sections = sectionsOf(kind);
  const from = sections.findIndex(
    (section) => section.sectionNum === sectionNum,
  );
  return sections
    .slice(from)
    .map((section) => section.sectionNum)
    .filter((num) => owned.has(num));
};

export const priceOfSections = (kind: SectionKind, sectionNums: string[]) =>
  sectionsOf(kind)
    .filter((section) => sectionNums.includes(section.sectionNum))
    .reduce((sum, section) => sum + section.price, 0);

export type RoleId =
  "cashiers" | "restockers" | "customerHelpers" | "securityGuards" | "janitors";

export interface Employee {
  id: string;
  storeLevel: number;
  hiringCost: number;
  dailyWage: number;
  /** The one extra stat a role has, such as checkouts for a cashier. */
  stat?: number;
}

const toEmployee = (
  employee: Omit<Employee, "stat">,
  stat?: number,
): Employee => ({
  id: employee.id,
  storeLevel: employee.storeLevel,
  hiringCost: employee.hiringCost,
  dailyWage: employee.dailyWage,
  stat,
});

/** One list drives every role section, so a new role needs data only. */
export const roles: { id: RoleId; employees: Employee[] }[] = [
  {
    id: "cashiers",
    employees: management.hiring.cashiers.map((e) =>
      toEmployee(e, e.completeCheckout),
    ),
  },
  {
    id: "restockers",
    employees: management.hiring.restockers.map((e) =>
      toEmployee(e, e.numberOfRacks),
    ),
  },
  {
    id: "customerHelpers",
    employees: management.hiring.customerHelpers.map((e) =>
      toEmployee(e, e.numberOfCheckouts),
    ),
  },
  {
    id: "securityGuards",
    employees: management.hiring.securityGuards.map((e) => toEmployee(e)),
  },
  {
    id: "janitors",
    employees: management.hiring.janitors.map((e) => toEmployee(e)),
  },
];

export const allEmployees = roles.flatMap((role) => role.employees);

/** "cashier_3" reads as 3, the number shown after the role name. */
export const employeeNumber = (employee: Employee) =>
  Number(employee.id.slice(employee.id.lastIndexOf("_") + 1));

export const hiredOf = (employees: Employee[], playthrough: Playthrough) => {
  const hired = new Set(playthrough.hiredEmployees ?? []);
  return employees.filter((employee) => hired.has(employee.id));
};

export const hiringTotals = (
  employees: Employee[],
  playthrough: Playthrough,
) => {
  const hired = hiredOf(employees, playthrough);
  return {
    hired: hired.length,
    total: employees.length,
    dailyWages: hired.reduce((sum, employee) => sum + employee.dailyWage, 0),
    hiringCosts: hired.reduce((sum, employee) => sum + employee.hiringCost, 0),
  };
};

export const customizationsTotal = management.customizations.reduce(
  (sum, customization) => sum + customization.price,
  0,
);
