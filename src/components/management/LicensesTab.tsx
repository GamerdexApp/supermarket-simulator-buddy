"use client";

import { useId, useMemo, useState } from "react";
import type { License } from "@/types";
import type { Playthrough } from "@/types/playthrough";
import { formatMoney } from "@/lib/format";
import { useListEdit } from "@/lib/hooks/useListEdit";
import { managementText } from "@/lib/messages/management";
import { readStoreLevel } from "@/service/appData";
import type { LicenseShow, LicenseSort, UnlockState } from "@/service/management";
import {
	countKnown,
	filterLicenses,
	licenseNumber,
	licenseProducts,
	licenseState,
	productLabel,
} from "@/service/management";
import { spending } from "@/service/spending";
import { management } from "@/data/supermarket-simulator/management";
import { FilterBlock } from "@/comps/page/FilterBlock";
import type { FilterFieldConfig } from "@/comps/page/FilterBlock";
import { LockReason } from "@/comps/page/LockReason";
import { SpendSummary } from "@/comps/page/SpendSummary";
import { Badge } from "@/comps/ui/Badge";
import { Button } from "@/comps/ui/Button";
import { Card } from "@/comps/ui/Card";
import { EmptyState } from "@/comps/ui/EmptyState";
import { SummaryTile } from "@/comps/ui/SummaryTile";
import { StoreLevelTile } from "./StoreLevelTile";

const text = managementText;
const licenseText = text.licenses;
const filterText = licenseText.filters;
const licenseIds = management.licenses.map((license) => license.id);

const STATE_TONE: Record<UnlockState, "kept" | "added" | "locked"> = {
	unlocked: "kept",
	canUnlock: "added",
	locked: "locked",
};

const fields: FilterFieldConfig[] = [
	{
		id: "show",
		label: filterText.show,
		options: (["all", "unlocked", "canUnlock", "locked"] as const).map((id) => ({
			id,
			label: filterText.showOptions[id],
		})),
	},
	{
		id: "sort",
		label: filterText.sort,
		options: (["number", "price", "storeLevel"] as const).map((id) => ({
			id,
			label: filterText.sortOptions[id],
		})),
	},
];

const DEFAULT_FILTERS = { show: "all", sort: "number" };

const priceText = (price: number) => (price === 0 ? text.free : formatMoney(price));

function Fact({ label, value }: { label: string; value: string }) {
	return (
		<div className="bg-bg flex flex-col rounded-md px-3 py-2">
			<span className="text-muted text-xs">{label}</span>
			<span className="font-mono font-medium">{value}</span>
		</div>
	);
}

interface LicenseCardProps {
	license: License;
	playthrough: Playthrough;
	onUnlock: () => void;
	onUndo: () => void;
}

function LicenseCard({ license, playthrough, onUnlock, onUndo }: LicenseCardProps) {
	const titleId = useId();
	const state = licenseState(license, playthrough);
	const products = licenseProducts(license);
	const number = licenseNumber(license);

	return (
		<Card
			role="group"
			aria-labelledby={titleId}
			className={`flex flex-col gap-3 p-4 ${state === "unlocked" ? "bg-tint" : ""} ${state === "locked" ? "border-dashed" : ""}`}
		>
			<div className="flex items-start justify-between gap-3">
				<h3 id={titleId} className="text-lg font-semibold">
					{licenseText.title(number)}
				</h3>
				<Badge tone={STATE_TONE[state]}>{text.states[state]}</Badge>
			</div>
			<div className="grid grid-cols-2 gap-2">
				<Fact label={licenseText.price} value={priceText(license.price)} />
				<Fact label={licenseText.level} value={String(license.storeLevel)} />
			</div>
			<div className="flex flex-col gap-1.5">
				<span className="font-medium">{licenseText.unlocks(products.length)}</span>
				<ul
					data-focus-inset
					tabIndex={0}
					aria-label={licenseText.unlocks(products.length)}
					className="border-line text-muted max-h-48 overflow-y-auto rounded-md border-[1.5px] px-3 py-2"
				>
					{products.map((product) => (
						<li key={productLabel(product)}>{productLabel(product)}</li>
					))}
				</ul>
			</div>
			{state === "unlocked" && (
				<Button variant="danger" onClick={onUndo}>
					{licenseText.undoUnlock}
				</Button>
			)}
			{state === "canUnlock" && (
				<Button variant="primary" onClick={onUnlock}>
					{licenseText.unlock}
				</Button>
			)}
			{state === "locked" && (
				<>
					<LockReason
						reasons={[
							text.requiresLevel(license.storeLevel, readStoreLevel(playthrough)),
						]}
					/>
					<Button disabled>{text.locked}</Button>
				</>
			)}
		</Card>
	);
}

export function LicensesTab({ playthrough }: { playthrough: Playthrough }) {
	const [filters, setFilters] = useState<Record<string, string>>(DEFAULT_FILTERS);
	const [search, setSearch] = useState("");
	const { add, remove } = useListEdit(playthrough.id, "unlockedLicenses");

	const visible = useMemo(
		() =>
			filterLicenses(playthrough, {
				show: filters.show as LicenseShow,
				sort: filters.sort as LicenseSort,
				search,
			}),
		[playthrough, filters, search]
	);
	const unlocked = countKnown(playthrough.unlockedLicenses, licenseIds);
	const states = management.licenses.map((license) => licenseState(license, playthrough));

	return (
		<div className="flex flex-col gap-4">
			<SpendSummary
				label={licenseText.totalSpent}
				amount={spending(playthrough).licenses}
				progress={unlocked / licenseIds.length}
				progressText={licenseText.unlockedOf(unlocked, licenseIds.length)}
				tiles={
					<>
						<SummaryTile
							label={licenseText.canUnlockNow}
							value={states.filter((state) => state === "canUnlock").length}
						/>
						<SummaryTile
							label={licenseText.lockedByLevel}
							value={states.filter((state) => state === "locked").length}
						/>
						<StoreLevelTile playthrough={playthrough} />
					</>
				}
			/>
			<FilterBlock
				fields={fields}
				values={filters}
				onChange={(id, value) => setFilters((current) => ({ ...current, [id]: value }))}
				onClear={() => {
					setFilters(DEFAULT_FILTERS);
					setSearch("");
				}}
				search={{ label: filterText.search, value: search, onChange: setSearch }}
				summary={filterText.summary(visible.length, licenseIds.length)}
				flyoutTitle={filterText.title}
				showLabel={filterText.showButton(visible.length)}
			/>
			{visible.length === 0 ? (
				<EmptyState
					title={licenseText.noMatch}
					description={licenseText.noMatchDescription}
				/>
			) : (
				<div className="grid items-start gap-4 md:grid-cols-2 2xl:grid-cols-3">
					{visible.map((license) => {
						const number = licenseNumber(license);
						return (
							<LicenseCard
								key={license.id}
								license={license}
								playthrough={playthrough}
								onUnlock={() => add([license.id], licenseText.unlocked(number))}
								onUndo={() => remove([license.id], licenseText.undone(number))}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
