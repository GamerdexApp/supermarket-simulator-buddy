"use client";

import { useTranslations } from "next-intl";
import { useId } from "react";
import type { Playthrough } from "@/types/playthrough";
import { formatMoney } from "@/lib/format";
import { useListEdit } from "@/lib/hooks/useListEdit";
import type { UnlockState } from "@/service/management";
import { LockReason } from "@/comps/page/LockReason";
import { SpendSummary } from "@/comps/page/SpendSummary";
import { Badge } from "@/comps/ui/Badge";
import { Button } from "@/comps/ui/Button";
import { Card } from "@/comps/ui/Card";
import { ItemImage } from "./ItemImage";

export interface OwnedItem {
	name: string;
	description: string;
	unitPrice: number;
	imageUrl: string;
	state: UnlockState;
	/** Small facts under the description, such as the store level a vehicle needs. */
	facts?: { label: string; value: string }[];
	/** Why a locked item cannot be unlocked yet. */
	lockReason?: string;
}

interface OwnedItemsTabProps {
	playthrough: Playthrough;
	field: "unlockedTools" | "unlockedVehicles";
	items: OwnedItem[];
	totalSpentLabel: string;
	unlockedOf: (owned: number, total: number) => string;
	unlockedToast: (name: string) => string;
	undoneToast: (name: string) => string;
}

function OwnedItemCard({
	item,
	onUnlock,
	onUndo,
}: {
	item: OwnedItem;
	onUnlock: () => void;
	onUndo: () => void;
}) {
	const t = useTranslations("market");
	const titleId = useId();
	const facts = item.facts ?? [
		{
			label: t("vehicles.price"),
			value: item.unitPrice === 0 ? t("free") : formatMoney(item.unitPrice),
		},
	];

	return (
		<Card
			role="group"
			aria-labelledby={titleId}
			className={`flex flex-col gap-3 p-4 ${item.state === "unlocked" ? "bg-tint" : ""} ${item.state === "locked" ? "border-dashed" : ""}`}
		>
			<div className="flex items-start gap-3">
				<ItemImage src={item.imageUrl} muted={item.state === "locked"} />
				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<div className="flex items-start justify-between gap-2">
						<h2 id={titleId} className="font-semibold">
							{item.name}
						</h2>
						{item.state === "unlocked" && (
							<Badge tone="kept">{t("states.unlocked")}</Badge>
						)}
					</div>
					<p className="text-muted">{item.description}</p>
				</div>
			</div>
			<div className="grid grid-cols-2 gap-2">
				{facts.map((fact) => (
					<div key={fact.label} className="bg-bg flex flex-col rounded-md px-2.5 py-1.5">
						<span className="text-muted text-xs">{fact.label}</span>
						<span className="font-mono font-medium">{fact.value}</span>
					</div>
				))}
			</div>
			{item.state === "unlocked" && (
				<Button variant="danger" onClick={onUndo}>
					{t("undoUnlock")}
				</Button>
			)}
			{item.state === "canUnlock" && (
				<Button variant="primary" onClick={onUnlock}>
					{t("unlock")}
				</Button>
			)}
			{item.state === "locked" && (
				<>
					{item.lockReason && <LockReason reasons={[item.lockReason]} />}
					<Button disabled>{t("locked")}</Button>
				</>
			)}
		</Card>
	);
}

/** Tools and vehicles: things a playthrough owns by name, with Undo on every unlock. */
export function OwnedItemsTab({
	playthrough,
	field,
	items,
	totalSpentLabel,
	unlockedOf,
	unlockedToast,
	undoneToast,
}: OwnedItemsTabProps) {
	const { add, remove } = useListEdit(playthrough.id, field);
	const owned = items.filter((item) => item.state === "unlocked");

	return (
		<div className="flex flex-col gap-4">
			<SpendSummary
				label={totalSpentLabel}
				amount={owned.reduce((sum, item) => sum + item.unitPrice, 0)}
				progress={owned.length / items.length}
				progressText={unlockedOf(owned.length, items.length)}
			/>
			<div className="grid items-start gap-4 md:grid-cols-2 2xl:grid-cols-3">
				{items.map((item) => (
					<OwnedItemCard
						key={item.name}
						item={item}
						onUnlock={() => add([item.name], unlockedToast(item.name))}
						onUndo={() => remove([item.name], undoneToast(item.name))}
					/>
				))}
			</div>
		</div>
	);
}
