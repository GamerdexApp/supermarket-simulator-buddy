import type { IconType } from "react-icons";
import {
  LuBriefcase,
  LuLandmark,
  LuLayoutDashboard,
  LuListChecks,
  LuSettings,
  LuStore,
} from "react-icons/lu";

export const APP_NAME = "Supermarket Simulator Buddy";
export const HOME_HREF = "/";
export const OVERVIEW_HREF = "/overview";
export const PLAYTHROUGHS_HREF = "/playthroughs";
/** The Playthroughs page opens the New playthrough dialog for this address. */
export const NEW_PLAYTHROUGH_HREF = "/playthroughs?new=1";
export const SETTINGS_HREF = "/settings";

export type NavItemId =
  "overview" | "market" | "management" | "bank" | "shoppingList" | "settings";

export interface NavItem {
  id: NavItemId;
  label: string;
  href: string;
  icon: IconType;
}

export interface NavGroup {
  id: "store" | "plan" | null;
  label?: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    id: null,
    items: [
      {
        id: "overview",
        label: "Overview",
        href: OVERVIEW_HREF,
        icon: LuLayoutDashboard,
      },
    ],
  },
  {
    id: "store",
    label: "Your store",
    items: [
      { id: "market", label: "Market", href: "/market", icon: LuStore },
      {
        id: "management",
        label: "Management",
        href: "/management",
        icon: LuBriefcase,
      },
      { id: "bank", label: "Bank", href: "/bank", icon: LuLandmark },
    ],
  },
  {
    id: "plan",
    label: "Plan",
    items: [
      {
        id: "shoppingList",
        label: "Shopping list",
        href: "/shopping-list",
        icon: LuListChecks,
      },
    ],
  },
];

export const settingsNavItem: NavItem = {
  id: "settings",
  label: "Settings",
  href: SETTINGS_HREF,
  icon: LuSettings,
};

const pageTitles: Record<string, string> = {
  [PLAYTHROUGHS_HREF]: "Playthroughs",
};

export const isNavItemActive = (item: NavItem, pathname: string) =>
  pathname === item.href || pathname.startsWith(`${item.href}/`);

export const getPageTitle = (pathname: string): string => {
  const item = [
    ...navGroups.flatMap((group) => group.items),
    settingsNavItem,
  ].find((navItem) => isNavItemActive(navItem, pathname));
  return item?.label ?? pageTitles[pathname] ?? APP_NAME;
};
