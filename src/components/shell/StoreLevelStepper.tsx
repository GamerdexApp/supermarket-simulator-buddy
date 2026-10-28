"use client";

import { LuMinus, LuPlus } from "react-icons/lu";
import type { Playthrough } from "@/types/playthrough";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { shellText } from "@/lib/messages/shell";
import { uiText } from "@/lib/messages/ui";
import { readStoreLevel, setStoreLevel } from "@/service/appData";
import { IconButton } from "@/comps/ui/IconButton";
import { SectionLabel } from "@/comps/ui/SectionLabel";

const label = shellText.storeLevel.label;

/** The store level gates every unlock, so it sits in the sidebar instead of on a page. */
export function StoreLevelStepper({ playthrough }: { playthrough: Playthrough }) {
	const { updateData } = usePlaythrough();
	const level = readStoreLevel(playthrough);
	const change = (next: number) =>
		updateData((current) => setStoreLevel(current, playthrough.id, next));

	return (
		<div className="border-sb-line flex items-center justify-between gap-2 rounded-md border-[1.5px] py-1.5 ps-3 pe-1.5">
			<span className="flex flex-col">
				<SectionLabel className="text-sb-muted">{label}</SectionLabel>
				<span className="text-sb-text font-mono text-xl leading-tight font-medium">
					<span className="sr-only">{uiText.stepper.labelPrefix(label)}</span>
					{level}
				</span>
			</span>
			<span className="flex items-center gap-1.5">
				<IconButton
					label={uiText.stepper.lower(label)}
					disabled={level === 0}
					onClick={() => change(level - 1)}
					className="border-sb-line text-sb-text hover:bg-sb-line border-[1.5px] disabled:opacity-40"
				>
					<LuMinus size={16} aria-hidden="true" />
				</IconButton>
				<IconButton
					label={uiText.stepper.raise(label)}
					onClick={() => change(level + 1)}
					className="bg-accent text-sb-bg hover:opacity-90"
				>
					<LuPlus size={16} aria-hidden="true" />
				</IconButton>
			</span>
		</div>
	);
}
