"use client";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { settingsText } from "@/lib/messages/settings";
import type { Theme } from "@/lib/theme";
import { setTheme, useTheme } from "@/lib/theme";
import { RadioGroup } from "@/comps/ui/RadioGroup";
import { SettingsCard } from "./SettingsCard";

const text = settingsText.appearance;

const themeOptions = (["light", "dark", "system"] as const).map((id) => ({
	id,
	label: text.themes[id],
}));

function Appearance() {
	const theme = useTheme();
	const systemIsDark = useMediaQuery("(prefers-color-scheme: dark)");

	return (
		<SettingsCard title={text.title} description={text.description}>
			<RadioGroup<Theme>
				label={text.themeLabel}
				options={themeOptions}
				value={theme}
				onChange={setTheme}
			/>
			<p className="text-muted">
				{text.themeNote(systemIsDark ? text.themes.dark : text.themes.light)}
			</p>
		</SettingsCard>
	);
}

export function PreferencesTab() {
	return (
		<div className="grid items-start gap-4 lg:grid-cols-2">
			<Appearance />
		</div>
	);
}
