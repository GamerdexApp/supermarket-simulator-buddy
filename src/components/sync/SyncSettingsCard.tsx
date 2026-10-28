"use client";

import { useTranslations } from "next-intl";
import { useId } from "react";
import { type SyncSettingKey, useSync } from "@/lib/contexts/SyncContext";
import { Card } from "@/comps/ui/Card";
import { Switch } from "@/comps/ui/Switch";

const rows = [
	{ setting: "autoSync", textKey: "auto" },
	{ setting: "syncOnReturn", textKey: "focus" },
	{ setting: "waitOnMetered", textKey: "metered" },
] as const satisfies readonly { setting: SyncSettingKey; textKey: string }[];

function SettingRow({ setting, textKey }: (typeof rows)[number]) {
	const t = useTranslations("sync.settings");
	const { settings, setSyncSetting } = useSync();
	const base = useId();

	return (
		<div className="flex items-start justify-between gap-4">
			<div className="flex flex-col gap-0.5">
				<span id={`${base}-label`} className="font-semibold">
					{t(textKey)}
				</span>
				<span id={`${base}-hint`} className="text-muted">
					{t(`${textKey}Hint`)}
				</span>
			</div>
			<Switch
				checked={settings[setting]}
				onChange={(checked) => setSyncSetting(setting, checked)}
				labelledBy={`${base}-label`}
				describedBy={`${base}-hint`}
			/>
		</div>
	);
}

export function SyncSettingsCard() {
	const t = useTranslations("sync.settings");
	return (
		<Card className="flex flex-col gap-4 p-4">
			<h2 className="text-base font-semibold">{t("title")}</h2>
			{rows.map((row) => (
				<SettingRow key={row.setting} {...row} />
			))}
		</Card>
	);
}
