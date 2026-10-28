"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import type { FormEvent } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";
import type { Playthrough } from "@/types/playthrough";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { formatNumber } from "@/lib/format";
import { readStoreLevel, setStoreLevel } from "@/service/appData";
import { IconButton } from "@/comps/ui/IconButton";
import { SectionLabel } from "@/comps/ui/SectionLabel";

/** The store level gates every unlock, so it sits in the sidebar instead of on a page. */
export function StoreLevelStepper({ playthrough }: { playthrough: Playthrough }) {
	const t = useTranslations("shell.storeLevel");
	const tStepper = useTranslations("ui.stepper");
	const { updateData } = usePlaythrough();
	const [draft, setDraft] = useState<string | null>(null);
	const level = readStoreLevel(playthrough);

	const change = (next: number) =>
		updateData((current) => setStoreLevel(current, playthrough.id, next));

	const commitDraft = (event?: FormEvent) => {
		event?.preventDefault();
		const typed = Number(draft);
		if (draft !== null && draft.trim() !== "" && Number.isFinite(typed) && typed !== level) {
			change(typed);
		}
		setDraft(null);
	};

	return (
		<div className="border-sb-line flex items-center justify-between gap-2 rounded-md border-[1.5px] py-1.5 ps-3 pe-1.5">
			<span className="flex min-w-0 flex-col">
				<SectionLabel className="text-sb-muted">{t("label")}</SectionLabel>
				{draft === null ? (
					<button
						type="button"
						onClick={() => setDraft(String(level))}
						aria-label={t("edit", { level: formatNumber(level) })}
						className="text-sb-text w-fit font-mono text-xl leading-tight font-medium"
					>
						{formatNumber(level)}
					</button>
				) : (
					<form onSubmit={commitDraft}>
						<input
							type="number"
							inputMode="numeric"
							min={0}
							step={1}
							value={draft}
							aria-label={t("label")}
							autoFocus
							onChange={(event) => setDraft(event.target.value)}
							onBlur={() => commitDraft()}
							onKeyDown={(event) => {
								if (event.key === "Escape") setDraft(null);
							}}
							className="border-sb-line text-sb-text w-20 rounded border-[1.5px] bg-transparent px-1.5 font-mono text-lg"
						/>
					</form>
				)}
			</span>
			<span className="flex items-center gap-1.5">
				<IconButton
					label={level === 0 ? t("atZero") : tStepper("lower", { label: t("label") })}
					aria-disabled={level === 0}
					onClick={() => level > 0 && change(level - 1)}
					className="border-sb-line text-sb-text hover:bg-sb-line border-[1.5px] aria-disabled:opacity-40"
				>
					<LuMinus size={16} aria-hidden="true" />
				</IconButton>
				<IconButton
					label={tStepper("raise", { label: t("label") })}
					onClick={() => change(level + 1)}
					className="bg-accent text-sb-bg hover:opacity-90"
				>
					<LuPlus size={16} aria-hidden="true" />
				</IconButton>
			</span>
		</div>
	);
}
