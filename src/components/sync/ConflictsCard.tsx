"use client";

import type { Conflict } from "@gamerdexapp/gamerdex-sync";
import { useTranslations } from "next-intl";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { useSync } from "@/lib/contexts/SyncContext";
import { SettingsCard } from "@/comps/settings/SettingsCard";
import { Button } from "@/comps/ui/Button";

const valueText = (value: unknown) =>
	value === undefined ? null : typeof value === "string" ? value : JSON.stringify(value);

function ConflictRow({ conflict }: { conflict: Conflict }) {
	const t = useTranslations("sync.conflicts");
	const { playthroughs } = usePlaythrough();
	const { keepLocalValue } = useSync();
	const [section, playthroughId, ...rest] = conflict.path;
	const playthrough =
		section === "playthroughs"
			? playthroughs.find((other) => other.id === playthroughId)
			: null;
	const fields = (playthrough ? rest : [playthroughId, ...rest]).filter(
		(step) => step && step !== "data"
	);
	const where = [playthrough?.name ?? section, ...fields].join(" / ");

	return (
		<li className="border-line flex flex-col gap-2 border-t pt-3 first:border-t-0 first:pt-0">
			<p className="font-mono">{where}</p>
			{conflict.kind === "delete-edit" && <p className="text-muted">{t("deletedEdited")}</p>}
			<dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
				<dt className="text-muted">{t("cloudValue")}</dt>
				<dd className="font-mono break-all">{valueText(conflict.remote) ?? t("empty")}</dd>
				<dt className="text-muted">{t("deviceValue")}</dt>
				<dd className="font-mono break-all">{valueText(conflict.local) ?? t("empty")}</dd>
			</dl>
			<div>
				<Button onClick={() => keepLocalValue(conflict)}>{t("keepDevice")}</Button>
			</div>
		</li>
	);
}

export function ConflictsCard() {
	const t = useTranslations("sync.conflicts");
	const { conflicts, dismissConflicts } = useSync();
	if (conflicts.length === 0) return null;

	return (
		<SettingsCard
			title={t("title")}
			description={t("body")}
			aside={
				<Button variant="ghost" onClick={dismissConflicts}>
					{t("dismiss")}
				</Button>
			}
		>
			<ul className="flex flex-col gap-3">
				{conflicts.map((conflict, index) => (
					<ConflictRow key={`${conflict.path.join("/")}-${index}`} conflict={conflict} />
				))}
			</ul>
		</SettingsCard>
	);
}
