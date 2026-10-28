"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import type { Playthrough } from "@/types/playthrough";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { NEW_PLAYTHROUGH_HREF, PLAYTHROUGHS_HREF } from "@/data/nav";
import { ButtonLink } from "@/comps/ui/Button";
import { EmptyState } from "@/comps/ui/EmptyState";
import { PageHeader } from "./PageHeader";

interface PlaythroughGateProps {
	title: string;
	subline?: string;
	/** What the empty card says about this page. */
	emptyDescription?: string;
	children: (playthrough: Playthrough) => ReactNode;
}

/**
 * Shows the empty card in place when there is no active playthrough. The shell already holds the
 * page until storage is read, so the empty card only shows when there is truly none.
 */
export function PlaythroughGate({
	title,
	subline,
	emptyDescription,
	children,
}: PlaythroughGateProps) {
	const t = useTranslations("shell.empty");
	const { activePlaythrough } = usePlaythrough();

	if (!activePlaythrough) {
		return (
			<>
				<PageHeader title={title} subline={subline} />
				<EmptyState
					title={t("title")}
					description={emptyDescription ?? t("description")}
					actions={
						<>
							<ButtonLink href={NEW_PLAYTHROUGH_HREF} variant="primary">
								{t("create")}
							</ButtonLink>
							<ButtonLink href={PLAYTHROUGHS_HREF}>{t("all")}</ButtonLink>
						</>
					}
				/>
			</>
		);
	}
	return <>{children(activePlaythrough)}</>;
}
