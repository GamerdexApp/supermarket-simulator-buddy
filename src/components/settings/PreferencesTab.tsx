"use client";

import { useTranslations } from "next-intl";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import type { Theme } from "@/lib/theme";
import { setTheme, useTheme } from "@/lib/theme";
import { RadioGroup } from "@/comps/ui/RadioGroup";
import { RegionCard } from "./RegionCard";
import { SettingsCard } from "./SettingsCard";

const THEMES: Theme[] = ["light", "dark", "system"];

function Appearance() {
	const t = useTranslations("settings.appearance");
	const theme = useTheme();
	const themeOptions = THEMES.map((id) => ({ id, label: t(`themes.${id}`) }));
	const systemIsDark = useMediaQuery("(prefers-color-scheme: dark)");

	return (
		<SettingsCard title={t("title")} description={t("description")}>
			<RadioGroup<Theme>
				label={t("themeLabel")}
				options={themeOptions}
				value={theme}
				onChange={setTheme}
			/>
			<p className="text-muted">
				{t("themeNote", { mode: systemIsDark ? "dark" : "light" })}
			</p>
		</SettingsCard>
	);
}

export function PreferencesTab() {
	return (
		<div className="grid items-start gap-4 lg:grid-cols-2">
			<Appearance />
			<RegionCard />
		</div>
	);
}
