"use client";

import { useTranslations } from "next-intl";
import { useId, useMemo, useState } from "react";
import type { License } from "@/types";
import type { Playthrough } from "@/types/playthrough";
import { formatMoney, formatNumber } from "@/lib/format";
import { useListEdit } from "@/lib/hooks/useListEdit";
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

const licenseIds = management.licenses.map((license) => license.id);

const STATE_TONE: Record<UnlockState, "kept" | "added" | "locked"> = {
	unlocked: "kept",
	canUnlock: "added",
	locked: "locked",
};

const SHOW_IDS = ["all", "unlocked", "canUnlock", "locked"] as const;
const SORT_IDS = ["number", "price", "storeLevel"] as const;

const DEFAULT_FILTERS = { show: "all", sort: "number" };

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
	const t = useTranslations("management");
	const titleId = useId();
	const state = licenseState(license, playthrough);
	const products = licenseProducts(license);
	const number = licenseNumber(license);
	const unlocksText = t("licenses.unlocks", {
		count: products.length,
		amount: formatNumber(products.length),
	});

	return (
		<Card
			role="group"
			aria-labelledby={titleId}
			className={`flex flex-col gap-3 p-4 ${state === "unlocked" ? "bg-tint" : ""} ${state === "locked" ? "border-dashed" : ""}`}
		>
			<div className="flex items-start justify-between gap-3">
				<h2 id={titleId} className="text-lg font-semibold">
					{t("licenses.title", { number })}
				</h2>
				<Badge tone={STATE_TONE[state]}>{t(`states.${state}`)}</Badge>
			</div>
			<div className="grid grid-cols-2 gap-2">
				<Fact
					label={t("licenses.price")}
					value={license.price === 0 ? t("free") : formatMoney(license.price)}
				/>
				<Fact label={t("licenses.level")} value={formatNumber(license.storeLevel)} />
			</div>
			<div className="flex flex-col gap-1.5">
				<span className="font-medium">{unlocksText}</span>
				<ul
					data-focus-inset
					tabIndex={0}
					aria-label={unlocksText}
					className="border-line text-muted max-h-48 overflow-y-auto rounded-md border-[1.5px] px-3 py-2"
				>
					{products.map((product) => (
						<li key={productLabel(product)}>{productLabel(product)}</li>
					))}
				</ul>
			</div>
			{state === "unlocked" && (
				<Button variant="danger" onClick={onUndo}>
					{t("licenses.undoUnlock")}
				</Button>
			)}
			{state === "canUnlock" && (
				<Button variant="primary" onClick={onUnlock}>
					{t("licenses.unlock")}
				</Button>
			)}
			{state === "locked" && (
				<>
					<LockReason
						reasons={[
							t("requiresLevel", {
								level: license.storeLevel,
								current: readStoreLevel(playthrough),
							}),
						]}
					/>
					<Button disabled>{t("locked")}</Button>
				</>
			)}
		</Card>
	);
}

export function LicensesTab({ playthrough }: { playthrough: Playthrough }) {
	const t = useTranslations("management.licenses");
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
	const fields: FilterFieldConfig[] = [
		{
			id: "show",
			label: t("filters.show"),
			options: SHOW_IDS.map((id) => ({ id, label: t(`filters.showOptions.${id}`) })),
		},
		{
			id: "sort",
			label: t("filters.sort"),
			options: SORT_IDS.map((id) => ({ id, label: t(`filters.sortOptions.${id}`) })),
		},
	];

	return (
		<div className="flex flex-col gap-4">
			<SpendSummary
				label={t("totalSpent")}
				amount={spending(playthrough).licenses}
				progress={unlocked / licenseIds.length}
				progressText={t("unlockedOf", {
					owned: formatNumber(unlocked),
					count: licenseIds.length,
					amount: formatNumber(licenseIds.length),
				})}
				tiles={
					<>
						<SummaryTile
							label={t("canUnlockNow")}
							value={states.filter((state) => state === "canUnlock").length}
						/>
						<SummaryTile
							label={t("lockedByLevel")}
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
				search={{ label: t("filters.search"), value: search, onChange: setSearch }}
				summary={t("filters.summary", {
					shown: formatNumber(visible.length),
					count: licenseIds.length,
					amount: formatNumber(licenseIds.length),
				})}
				flyoutTitle={t("filters.title")}
				showLabel={t("filters.showButton", {
					count: visible.length,
					amount: formatNumber(visible.length),
				})}
			/>
			{visible.length === 0 ? (
				<EmptyState title={t("noMatch")} description={t("noMatchDescription")} />
			) : (
				<div className="grid items-start gap-4 md:grid-cols-2 2xl:grid-cols-3">
					{visible.map((license) => {
						const number = licenseNumber(license);
						return (
							<LicenseCard
								key={license.id}
								license={license}
								playthrough={playthrough}
								onUnlock={() => add([license.id], t("unlocked", { number }))}
								onUndo={() => remove([license.id], t("undone", { number }))}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
