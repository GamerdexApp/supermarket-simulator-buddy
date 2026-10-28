"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import type { ButtonHTMLAttributes } from "react";
import { LuChevronDown, LuPlus } from "react-icons/lu";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { formatNumber, formatShortDate } from "@/lib/format";
import { useIsDesktop } from "@/lib/hooks/useMediaQuery";
import { readStoreLevel } from "@/service/appData";
import { NEW_PLAYTHROUGH_HREF, PLAYTHROUGHS_HREF } from "@/data/nav";
import { Dialog } from "@/comps/ui/Dialog";
import { Menu, MenuItem, MenuLabel, MenuSeparator } from "@/comps/ui/Menu";
import { SectionLabel } from "@/comps/ui/SectionLabel";
import { useToast } from "@/comps/ui/Toast";

interface ChoicesProps {
	inMenu: boolean;
	close: () => void;
	onNavigate?: () => void;
}

function PlaythroughChoices({ inMenu, close, onNavigate }: ChoicesProps) {
	const t = useTranslations("shell.switcher");
	const { playthroughs, activePlaythrough, setActivePlaythrough } = usePlaythrough();
	const showToast = useToast();
	const role = inMenu ? "menuitem" : "button";
	const followLink = () => {
		close();
		onNavigate?.();
	};

	return (
		<>
			{playthroughs.length === 0 && (
				<>
					<p className="text-muted px-3 py-2">{t("empty")}</p>
					<MenuSeparator />
				</>
			)}
			{playthroughs.length > 0 && (
				<>
					{inMenu && <MenuLabel>{t("playthroughs")}</MenuLabel>}
					{playthroughs.map((playthrough) => {
						const isActive = playthrough.id === activePlaythrough?.id;
						return (
							<MenuItem
								key={playthrough.id}
								role={role}
								active={isActive}
								className="justify-between gap-2"
								onSelect={() => {
									if (!isActive) {
										setActivePlaythrough(playthrough.id);
										showToast({
											variant: "success",
											title: t("switched", { name: playthrough.name }),
										});
									}
									close();
								}}
							>
								<span className="flex min-w-0 flex-col">
									<span className="truncate font-medium">{playthrough.name}</span>
									<span className="text-muted truncate text-xs">
										{t("rowDetail", {
											level: formatNumber(readStoreLevel(playthrough)),
											date: formatShortDate(playthrough.lastModified),
										})}
									</span>
								</span>
								{isActive && (
									<span className="text-primary font-mono text-xs font-medium">
										{t("active")}
									</span>
								)}
							</MenuItem>
						);
					})}
					<MenuSeparator />
				</>
			)}
			<MenuItem
				role={role}
				href={PLAYTHROUGHS_HREF}
				onSelect={followLink}
				className="gap-2 font-medium"
			>
				{t("all")}
			</MenuItem>
			<MenuItem
				role={role}
				href={NEW_PLAYTHROUGH_HREF}
				onSelect={followLink}
				className="text-primary gap-2.5 font-semibold"
			>
				<LuPlus size={16} aria-hidden="true" />
				{t("create")}
			</MenuItem>
		</>
	);
}

export function PlaythroughSwitcher({ onNavigate }: { onNavigate?: () => void }) {
	const t = useTranslations("shell.switcher");
	const { activePlaythrough, isLoaded } = usePlaythrough();
	const isDesktop = useIsDesktop();
	const [sheetOpen, setSheetOpen] = useState(false);

	const triggerName = !isLoaded ? t("loading") : (activePlaythrough?.name ?? t("none"));

	const renderTrigger = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
		<button
			type="button"
			disabled={!isLoaded}
			{...props}
			className="border-sb-line text-sb-text flex min-h-12 w-full items-center justify-between gap-2 rounded-md border-[1.5px] px-3 text-start"
		>
			<span className="flex min-w-0 flex-col">
				<span className="truncate font-medium">{triggerName}</span>
				{activePlaythrough && (
					<span className="text-sb-muted truncate text-xs">
						{t("level", { level: formatNumber(readStoreLevel(activePlaythrough)) })}
					</span>
				)}
			</span>
			<LuChevronDown size={14} aria-hidden="true" className="text-sb-muted shrink-0" />
		</button>
	);

	return (
		<div className="flex flex-col gap-1.5">
			<SectionLabel className="text-sb-muted">{t("sectionLabel")}</SectionLabel>
			{isDesktop ? (
				<Menu label={t("switch")} trigger={({ props }) => renderTrigger(props)}>
					{(close) => <PlaythroughChoices inMenu close={close} onNavigate={onNavigate} />}
				</Menu>
			) : (
				<>
					{renderTrigger({
						"aria-haspopup": "dialog",
						onClick: () => setSheetOpen(true),
					})}
					<Dialog
						open={sheetOpen}
						onClose={() => setSheetOpen(false)}
						title={t("switch")}
					>
						<div className="-mx-2 flex flex-col gap-0.5">
							<PlaythroughChoices
								inMenu={false}
								close={() => setSheetOpen(false)}
								onNavigate={onNavigate}
							/>
						</div>
					</Dialog>
				</>
			)}
		</div>
	);
}
