"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { formatNumber, formatTime } from "@/lib/format";

const REFRESH_MS = 30_000;
const MINUTE_MS = 60_000;

export function useSavedLabel() {
	const t = useTranslations("ui.savedChip");
	const { lastSavedAt, saveFailed } = usePlaythrough();
	const [now, setNow] = useState(() => Date.now());

	useEffect(() => {
		const timer = setInterval(() => setNow(Date.now()), REFRESH_MS);
		return () => clearInterval(timer);
	}, []);

	if (saveFailed) return t("failed");
	if (!lastSavedAt) return t("automatic");

	const elapsed = Math.max(now, lastSavedAt.getTime()) - lastSavedAt.getTime();
	if (elapsed < MINUTE_MS) return t("justNow");
	if (elapsed < 60 * MINUTE_MS) {
		const minutes = Math.floor(elapsed / MINUTE_MS);
		return t("minutesAgo", { count: minutes, amount: formatNumber(minutes) });
	}
	return t("at", { time: formatTime(lastSavedAt) });
}

export function SavedChip() {
	const label = useSavedLabel();

	return (
		<span
			role="status"
			className="border-line bg-surface text-muted inline-flex h-8 items-center gap-2 rounded-full border-[1.5px] px-3 text-xs"
		>
			<span aria-hidden="true" className="bg-kept size-1.5 rounded-full" />
			{label}
		</span>
	);
}
