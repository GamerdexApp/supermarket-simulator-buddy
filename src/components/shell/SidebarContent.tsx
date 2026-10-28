"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Playthrough } from "@/types/playthrough";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { navCount } from "@/service/navCounts";
import type { NavItem } from "@/data/nav";
import { isNavItemActive, navGroups, settingsNavItem } from "@/data/nav";
import { SectionLabel } from "@/comps/ui/SectionLabel";
import { BrandMark } from "./BrandMark";
import { PlaythroughSwitcher } from "./PlaythroughSwitcher";
import { StoreLevelStepper } from "./StoreLevelStepper";

interface SidebarLinkProps {
	item: NavItem;
	playthrough: Playthrough | null;
	onNavigate?: () => void;
}

function SidebarLink({ item, playthrough, onNavigate }: SidebarLinkProps) {
	const t = useTranslations("shell.nav.items");
	const active = isNavItemActive(item, usePathname());
	const count = playthrough ? navCount(item.id, playthrough) : null;
	const muted = !playthrough && item.id !== "settings";
	const Icon = item.icon;

	return (
		<Link
			href={item.href}
			onClick={onNavigate}
			aria-current={active ? "page" : undefined}
			className={`flex h-10 items-center gap-2.5 rounded-md px-2.5 lg:h-9 ${
				active
					? "bg-sb-active-bg text-sb-active-text focus-visible:outline-sb-active-text font-semibold"
					: `hover:bg-sb-line ${muted ? "text-sb-muted" : "text-sb-text"}`
			}`}
		>
			<Icon size={16} aria-hidden="true" className="shrink-0" />
			<span className="flex-1">{t(item.id)}</span>
			{count !== null && <span className="font-mono text-xs">{count}</span>}
		</Link>
	);
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
	const t = useTranslations("shell");
	const { activePlaythrough, isLoaded } = usePlaythrough();

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4 [--ring:var(--color-sb-ring)]">
			<BrandMark onNavigate={onNavigate} />
			<div className="flex flex-col gap-2">
				<PlaythroughSwitcher onNavigate={onNavigate} />
				{activePlaythrough && <StoreLevelStepper playthrough={activePlaythrough} />}
			</div>
			<nav
				aria-label={t("mainNav")}
				data-focus-inset
				className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto"
			>
				{isLoaded && !activePlaythrough && (
					<p className="text-sb-muted px-2.5 pb-1 text-[13px]">
						{t("noPlaythroughHint")}
					</p>
				)}
				{navGroups.map((group) => (
					<div key={group.id ?? "top"} className="flex flex-col gap-0.5">
						{group.id && (
							<SectionLabel className="text-sb-muted mt-2 px-2.5 pb-0.5">
								{t(`nav.groups.${group.id}`)}
							</SectionLabel>
						)}
						{group.items.map((item) => (
							<SidebarLink
								key={item.href}
								item={item}
								playthrough={activePlaythrough}
								onNavigate={onNavigate}
							/>
						))}
					</div>
				))}
			</nav>
			<div data-focus-inset className="border-sb-line border-t-[1.5px] pt-3">
				<SidebarLink
					item={settingsNavItem}
					playthrough={activePlaythrough}
					onNavigate={onNavigate}
				/>
			</div>
		</div>
	);
}
