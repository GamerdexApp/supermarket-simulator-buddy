"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { LuPlus, LuShoppingCart, LuTrash2 } from "react-icons/lu";
import type { AppData, Playthrough, ShoppingListItem } from "@/types/playthrough";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { formatNumber } from "@/lib/format";
import { updatePlaythrough } from "@/service/appData";
import { currentProductName } from "@/service/products";
import type { PendingItem } from "@/service/shopping";
import {
	addItems,
	groupByShop,
	listSummary,
	removeItem,
	resetList,
	setBoxes,
	togglePurchased,
} from "@/service/shopping";
import { PageHeader } from "@/comps/shell/PageHeader";
import { PlaythroughGate } from "@/comps/shell/PlaythroughGate";
import { Badge } from "@/comps/ui/Badge";
import { Button, ButtonLink } from "@/comps/ui/Button";
import { Card } from "@/comps/ui/Card";
import { IconButton } from "@/comps/ui/IconButton";
import { Note } from "@/comps/ui/Note";
import { useToast } from "@/comps/ui/Toast";
import { ValueStepper } from "@/comps/ui/ValueStepper";
import { AddProductsDialog } from "./AddProductsDialog";
import { useShopName } from "./useShopName";

const EMPTY_STEPS = ["item1", "item2", "item3"] as const;

const counted = (count: number) => ({ count, amount: formatNumber(count) });

const itemLabel = (item: ShoppingListItem) =>
	[item.company, currentProductName(item.productName)].filter(Boolean).join(" - ");

function useListChange(playthrough: Playthrough) {
	const t = useTranslations("shopping");
	const { updateData } = usePlaythrough();
	const showToast = useToast();

	const change = (update: (current: AppData) => AppData) => {
		updateData(update);
	};

	/** Undo puts back only the shopping list, so other edits made since then stay. */
	const changeWithUndo = (
		update: (current: AppData) => AppData,
		toast: { title: string; message?: string }
	) => {
		const previous = updateData(update);
		if (!previous) return;
		const previousList = previous.playthroughs.find(
			(p) => p.id === playthrough.id
		)?.shoppingList;
		showToast({
			variant: "success",
			...toast,
			action: {
				label: t("undo"),
				onAction: () =>
					updateData((current) =>
						updatePlaythrough(current, playthrough.id, { shoppingList: previousList })
					),
			},
		});
	};

	return { change, changeWithUndo };
}

function ItemRow({
	item,
	onToggle,
	onBoxes,
	onRemove,
}: {
	item: ShoppingListItem;
	onToggle: () => void;
	onBoxes: (boxes: number) => void;
	onRemove: () => void;
}) {
	const name = currentProductName(item.productName);
	const label = itemLabel(item);
	const t = useTranslations("shopping");

	return (
		<li
			className={`border-line flex flex-wrap items-center gap-3 border-t-[1.5px] px-1 py-2.5 first:border-t-0 ${item.purchased ? "bg-tint" : ""}`}
		>
			<label className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center gap-3 lg:min-h-9">
				<input
					type="checkbox"
					checked={item.purchased}
					onChange={onToggle}
					aria-label={t("row.purchased", { label })}
					className="accent-primary size-5 shrink-0"
				/>
				<span className="flex min-w-0 flex-col">
					<span className={`font-medium ${item.purchased ? "line-through" : ""}`}>
						{name}
					</span>
					{item.company && <span className="text-muted text-xs">{item.company}</span>}
				</span>
			</label>
			<span className="flex items-center gap-1">
				<ValueStepper
					label={t("row.boxes")}
					value={item.boxes}
					min={1}
					max={Number.MAX_SAFE_INTEGER}
					display={t("dialog.boxes", counted(item.boxes))}
					onChange={onBoxes}
				/>
				<IconButton
					label={t("row.remove", { label })}
					onClick={onRemove}
					className="text-danger hover:bg-tint"
				>
					<LuTrash2 size={16} aria-hidden="true" />
				</IconButton>
			</span>
		</li>
	);
}

function EmptyList({ onAdd }: { onAdd: () => void }) {
	const t = useTranslations("shopping");
	return (
		<Card className="flex flex-col items-center gap-3 border-dashed px-6 py-10 text-center">
			<LuShoppingCart size={32} aria-hidden="true" className="text-primary" />
			<h2 className="text-lg font-semibold">{t("empty.title")}</h2>
			<p className="text-muted max-w-md">{t("empty.body")}</p>
			<Button variant="primary" onClick={onAdd}>
				<LuPlus size={16} aria-hidden="true" />
				{t("addProducts")}
			</Button>
			<ol className="text-muted list-decimal ps-5 text-start">
				{EMPTY_STEPS.map((step) => (
					<li key={step}>{t(`empty.steps.${step}`)}</li>
				))}
			</ol>
			<p className="text-muted">
				{t("empty.missing")}{" "}
				<ButtonLink href="/management?tab=licenses" variant="link">
					{t("empty.toManagement")}
				</ButtonLink>
			</p>
		</Card>
	);
}

function ShoppingContent({ playthrough }: { playthrough: Playthrough }) {
	const t = useTranslations("shopping");
	const shopLabel = useShopName();
	const [adding, setAdding] = useState(false);
	const [confirmingReset, setConfirmingReset] = useState(false);
	const { change, changeWithUndo } = useListChange(playthrough);
	const items = playthrough.shoppingList ?? [];
	const summary = listSummary(items);
	const id = playthrough.id;

	const submit = (pending: PendingItem[]) => {
		setAdding(false);
		changeWithUndo((current) => addItems(current, id, pending), {
			title: t("dialog.added", counted(pending.length)),
		});
	};

	return (
		<>
			<PageHeader
				title={t("title")}
				subline={t("subline", { name: playthrough.name })}
				actions={
					<Button variant="primary" onClick={() => setAdding(true)}>
						<LuPlus size={16} aria-hidden="true" />
						{t("addProducts")}
					</Button>
				}
			/>
			{items.length === 0 ? (
				<EmptyList onAdd={() => setAdding(true)} />
			) : (
				<>
					<Card className="flex flex-col gap-3 p-4">
						<div className="flex flex-wrap items-center justify-between gap-3">
							<div className="flex flex-col">
								<h2 className="text-lg font-semibold">{t("summary.title")}</h2>
								<span className="text-muted">
									{t("summary.purchased", {
										bought: formatNumber(summary.bought),
										...counted(summary.total),
									})}{" "}
									· {t("summary.boxes", counted(summary.boxes))}
								</span>
							</div>
							{!confirmingReset && (
								<Button variant="danger" onClick={() => setConfirmingReset(true)}>
									{t("summary.reset")}
								</Button>
							)}
						</div>
						{confirmingReset && (
							<Note tone="warning" title={t("reset.title")}>
								<span className="flex flex-col gap-3">
									<span>
										{t("reset.body", {
											...counted(summary.total),
											bought: formatNumber(summary.bought),
											boxCount: summary.boxes,
											boxes: formatNumber(summary.boxes),
										})}
									</span>
									<span className="flex flex-wrap gap-2">
										<Button
											data-autofocus
											onClick={() => setConfirmingReset(false)}
										>
											{t("reset.cancel")}
										</Button>
										<Button
											variant="danger"
											onClick={() => {
												setConfirmingReset(false);
												changeWithUndo(
													(current) => resetList(current, id),
													{
														title: t("reset.done"),
														message: t(
															"reset.doneMessage",
															counted(summary.total)
														),
													}
												);
											}}
										>
											{t("reset.confirm")}
										</Button>
									</span>
								</span>
							</Note>
						)}
					</Card>
					<div className="grid items-start gap-4 lg:grid-cols-2">
						{groupByShop(items).map((group) => (
							<Card key={group.store} className="flex flex-col gap-2 p-4">
								<div className="flex items-start justify-between gap-3">
									<div className="flex flex-col">
										<h2 className="text-lg font-semibold">
											{shopLabel(group.store)}
										</h2>
										<span className="text-muted text-xs">
											{t("shop.progress", {
												bought: formatNumber(group.bought),
												total: formatNumber(group.items.length),
												...counted(group.boxes),
											})}
										</span>
									</div>
									<Badge tone="added">
										{t("shop.items", counted(group.items.length))}
									</Badge>
								</div>
								<ul className="flex flex-col">
									{group.items.map((item) => (
										<ItemRow
											key={item.id}
											item={item}
											onToggle={() =>
												change((current) =>
													togglePurchased(current, id, item.id)
												)
											}
											onBoxes={(boxes) =>
												change((current) =>
													setBoxes(current, id, item.id, boxes)
												)
											}
											onRemove={() =>
												changeWithUndo(
													(current) => removeItem(current, id, item.id),
													{
														title: t("row.removed", {
															name: currentProductName(
																item.productName
															),
														}),
													}
												)
											}
										/>
									))}
								</ul>
							</Card>
						))}
					</div>
				</>
			)}
			<AddProductsDialog
				open={adding}
				playthrough={playthrough}
				onClose={() => setAdding(false)}
				onSubmit={submit}
			/>
		</>
	);
}

export function ShoppingListPage() {
	const t = useTranslations("shopping");
	return (
		<PlaythroughGate title={t("title")} emptyDescription={t("emptyDescription")}>
			{(playthrough) => <ShoppingContent playthrough={playthrough} />}
		</PlaythroughGate>
	);
}
