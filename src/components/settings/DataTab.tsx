"use client";

import { useTranslations } from "next-intl";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { formatNumber } from "@/lib/format";
import { PLAYTHROUGHS_HREF } from "@/data/nav";
import { Badge } from "@/comps/ui/Badge";
import { ButtonLink } from "@/comps/ui/Button";
import { Note } from "@/comps/ui/Note";
import { DataCard } from "./DataCard";
import { SettingsCard } from "./SettingsCard";

export function DataTab() {
	const t = useTranslations("settings");
	const { playthroughs } = usePlaythrough();

	return (
		<div className="grid items-start gap-4 lg:grid-cols-2">
			<div className="flex flex-col gap-4">
				<Note title={t("storageNote.title")}>{t("storageNote.body")}</Note>
				<DataCard />
			</div>
			<SettingsCard
				title={t("playthroughs.title")}
				description={t("playthroughs.description")}
				aside={
					<Badge tone="added">
						{t("playthroughCount", {
							count: playthroughs.length,
							amount: formatNumber(playthroughs.length),
						})}
					</Badge>
				}
			>
				<div>
					<ButtonLink href={PLAYTHROUGHS_HREF}>{t("playthroughs.manage")}</ButtonLink>
				</div>
			</SettingsCard>
		</div>
	);
}
