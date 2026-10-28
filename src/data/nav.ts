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
export const SYNC_HREF = "/settings?tab=sync";
export const BACKUP_HREF = "/settings?tab=data";

export type NavItemId =
  "overview" | "market" | "management" | "bank" | "shoppingList" | "settings";

export interface NavItem {
  id: NavItemId;
  href: string;
  icon: IconType;
}

export interface NavGroup {
  id: "store" | "plan" | null;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    id: null,
    items: [{ id: "overview", href: OVERVIEW_HREF, icon: LuLayoutDashboard }],
  },
  {
    id: "store",
    items: [
      { id: "market", href: "/market", icon: LuStore },
      { id: "management", href: "/management", icon: LuBriefcase },
      { id: "bank", href: "/bank", icon: LuLandmark },
    ],
  },
  {
    id: "plan",
    items: [{ id: "shoppingList", href: "/shopping-list", icon: LuListChecks }],
  },
];

export const settingsNavItem: NavItem = {
  id: "settings",
  href: SETTINGS_HREF,
  icon: LuSettings,
};

export const isNavItemActive = (item: NavItem, pathname: string) =>
  pathname === item.href || pathname.startsWith(`${item.href}/`);

export type PageRouteId = NavItemId | "playthroughs";

/** The page a path belongs to, for its title, or null for the landing page and unknown paths. */
export const getPageRouteId = (pathname: string): PageRouteId | null => {
  if (pathname === PLAYTHROUGHS_HREF) return "playthroughs";
  const item = [
    ...navGroups.flatMap((group) => group.items),
    settingsNavItem,
  ].find((navItem) => isNavItemActive(navItem, pathname));
  return item?.id ?? null;
};
