"use client";

import { settingsText } from "@/lib/messages/settings";
import type { Theme } from "@/lib/theme";
import { setTheme, useTheme } from "@/lib/theme";
import { SegmentedControl } from "@/comps/ui/SegmentedControl";

const text = settingsText.appearance;

const OPTIONS: { id: Theme; label: string }[] = [
	{ id: "light", label: text.themes.light },
	{ id: "dark", label: text.themes.dark },
	{ id: "system", label: text.themes.system },
];

export function ThemeChoice() {
	const theme = useTheme();

	return (
		<SegmentedControl
			label={text.themeLabel}
			options={OPTIONS}
			value={theme}
			onChange={setTheme}
		/>
	);
}
