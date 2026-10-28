"use client";

import { useTranslations } from "next-intl";
import type { Theme } from "@/lib/theme";
import { setTheme, useTheme } from "@/lib/theme";
import { SegmentedControl } from "@/comps/ui/SegmentedControl";

const THEMES: Theme[] = ["light", "dark", "system"];

export function ThemeChoice() {
	const t = useTranslations("settings.appearance");
	const theme = useTheme();
	const options = THEMES.map((id) => ({ id, label: t(`themes.${id}`) }));

	return (
		<SegmentedControl
			label={t("themeLabel")}
			options={options}
			value={theme}
			onChange={setTheme}
		/>
	);
}
