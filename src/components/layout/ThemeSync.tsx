"use client";

import { useEffect } from "react";
import { watchSystemTheme } from "@/lib/theme";

export function ThemeSync() {
	useEffect(watchSystemTheme, []);
	return null;
}
