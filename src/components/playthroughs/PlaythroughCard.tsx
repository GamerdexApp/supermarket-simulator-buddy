"use client";

import { useId } from "react";
import type { Playthrough } from "@/types/playthrough";
import { formatDate, formatMoney } from "@/lib/format";
import { playthroughsText } from "@/lib/messages/playthroughs";
import { readStoreLevel } from "@/service/appData";
import { licensesUnlocked, shoppingItemsBought } from "@/service/playthroughList";
import { spending } from "@/service/spending";
import { OVERVIEW_HREF } from "@/data/nav";
import { Badge } from "@/comps/ui/Badge";
import { Button, ButtonLink } from "@/comps/ui/Button";
import { Card } from "@/comps/ui/Card";

const text = playthroughsText.card;

function Figure({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex flex-col">
			<span className="text-muted text-xs">{label}</span>
			<span className="font-mono font-medium">{value}</span>
		</div>
	);
}

interface PlaythroughCardProps {
	playthrough: Playthrough;
	isActive: boolean;
	onSetActive: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

export function PlaythroughCard({
	playthrough,
	isActive,
	onSetActive,
	onEdit,
	onDelete,
}: PlaythroughCardProps) {
	const titleId = useId();
	const licenses = licensesUnlocked(playthrough);
	const shopping = shoppingItemsBought(playthrough);

	return (
		<Card
			role="group"
			aria-labelledby={titleId}
			highlighted={isActive}
			className="flex flex-col gap-3 p-4"
		>
			<div className="flex items-start justify-between gap-3">
				<h2 id={titleId} className="min-w-0 truncate text-lg font-semibold">
					{playthrough.name}
				</h2>
				{isActive && <Badge tone="kept">{text.active}</Badge>}
			</div>
			{playthrough.description && <p className="text-muted">{playthrough.description}</p>}
			<div className="bg-bg grid grid-cols-2 gap-3 rounded-md px-3 py-2.5">
				<Figure label={text.storeLevel} value={String(readStoreLevel(playthrough))} />
				<Figure label={text.spending} value={formatMoney(spending(playthrough).total)} />
				<Figure
					label={text.licenses}
					value={text.ofTotal(licenses.owned, licenses.total)}
				/>
				<Figure
					label={text.shopping}
					value={text.ofTotal(shopping.bought, shopping.total)}
				/>
			</div>
			<p className="text-muted flex flex-col text-xs">
				<span>{text.created(formatDate(playthrough.createdAt))}</span>
				<span>{text.lastModified(formatDate(playthrough.lastModified))}</span>
			</p>
			<div className="flex flex-wrap gap-2">
				{isActive ? (
					<ButtonLink
						href={OVERVIEW_HREF}
						variant="primary"
						className="max-sm:basis-full sm:flex-1"
					>
						{text.openOverview}
					</ButtonLink>
				) : (
					<Button
						variant="primary"
						className="max-sm:basis-full sm:flex-1"
						onClick={onSetActive}
					>
						{text.setActive}
					</Button>
				)}
				<Button className="max-sm:flex-1" onClick={onEdit}>
					{text.edit}
				</Button>
				<Button variant="danger" className="max-sm:flex-1" onClick={onDelete}>
					{text.delete}
				</Button>
			</div>
		</Card>
	);
}
