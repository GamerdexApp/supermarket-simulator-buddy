"use client";

import type { ReactNode } from "react";
import type { Playthrough } from "@/types/playthrough";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { shellText } from "@/lib/messages/shell";
import { NEW_PLAYTHROUGH_HREF, PLAYTHROUGHS_HREF } from "@/data/nav";
import { ButtonLink } from "@/comps/ui/Button";
import { EmptyState } from "@/comps/ui/EmptyState";
import { PageHeader } from "./PageHeader";

const text = shellText.empty;

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
	emptyDescription = text.description,
	children,
}: PlaythroughGateProps) {
	const { activePlaythrough } = usePlaythrough();

	if (!activePlaythrough) {
		return (
			<>
				<PageHeader title={title} subline={subline} />
				<EmptyState
					title={text.title}
					description={emptyDescription}
					actions={
						<>
							<ButtonLink href={NEW_PLAYTHROUGH_HREF} variant="primary">
								{text.create}
							</ButtonLink>
							<ButtonLink href={PLAYTHROUGHS_HREF}>{text.all}</ButtonLink>
						</>
					}
				/>
			</>
		);
	}
	return <>{children(activePlaythrough)}</>;
}
