"use client";

import { useTranslations } from "next-intl";
import { Suspense } from "react";
import type { Playthrough } from "@/types/playthrough";
import { formatMoney, formatNumber } from "@/lib/format";
import { useUrlTab } from "@/lib/hooks/useUrlTab";
import { readStoreLevel } from "@/service/appData";
import { ownedLicenseCount, toolState, vehicleState } from "@/service/market";
import { market } from "@/data/supermarket-simulator/market";
import { PageHeader } from "@/comps/shell/PageHeader";
import { PlaythroughGate } from "@/comps/shell/PlaythroughGate";
import { Tabs } from "@/comps/ui/Tabs";
import { OwnedItemsTab } from "./OwnedItemsTab";
import { PriceListTab } from "./PriceListTab";
import { ProductsTab } from "./ProductsTab";

const tabIds = ["products", "furniture", "paint", "tools", "vehicles"] as const;

const counts = {
	products: market.products.length,
	furniture: market.furnitures.length,
	paint: market.paints.length,
	tools: market.tools.length,
	vehicles: market.vehicles.length,
};

function ToolsTab({ playthrough }: { playthrough: Playthrough }) {
	const t = useTranslations("market.tools");
	const owned = ownedLicenseCount(playthrough);
	return (
		<OwnedItemsTab
			playthrough={playthrough}
			field="unlockedTools"
			items={market.tools.map((tool) => ({
				...tool,
				state: toolState(tool, playthrough),
				lockReason: tool.requiredLicenses
					? t("requiresLicenses", {
							count: tool.requiredLicenses,
							amount: formatNumber(tool.requiredLicenses),
							owned: formatNumber(owned),
						})
					: undefined,
			}))}
			totalSpentLabel={t("totalSpent")}
			unlockedOf={(ownedTools, total) =>
				t("unlockedOf", {
					owned: formatNumber(ownedTools),
					count: total,
					amount: formatNumber(total),
				})
			}
			unlockedToast={(name) => t("unlocked", { name })}
			undoneToast={(name) => t("undone", { name })}
		/>
	);
}

function VehiclesTab({ playthrough }: { playthrough: Playthrough }) {
	const t = useTranslations("market");
	const level = readStoreLevel(playthrough);
	return (
		<OwnedItemsTab
			playthrough={playthrough}
			field="unlockedVehicles"
			items={market.vehicles.map((vehicle) => ({
				...vehicle,
				state: vehicleState(vehicle, playthrough),
				facts: [
					{
						label: t("vehicles.price"),
						value: vehicle.unitPrice === 0 ? t("free") : formatMoney(vehicle.unitPrice),
					},
					{ label: t("vehicles.storeLevel"), value: formatNumber(vehicle.storeLevel) },
				],
				lockReason: t("vehicles.requiresLevel", {
					level: vehicle.storeLevel,
					current: level,
				}),
			}))}
			totalSpentLabel={t("vehicles.totalSpent")}
			unlockedOf={(owned, total) =>
				t("vehicles.unlockedOf", {
					owned: formatNumber(owned),
					count: total,
					amount: formatNumber(total),
				})
			}
			unlockedToast={(name) => t("vehicles.unlocked", { name })}
			undoneToast={(name) => t("vehicles.undone", { name })}
		/>
	);
}

function MarketContent({ playthrough }: { playthrough: Playthrough }) {
	const t = useTranslations("market");
	const [activeTab, setActiveTab] = useUrlTab(tabIds, "products");

	return (
		<>
			<PageHeader
				title={t("title")}
				subline={t(`sublines.${activeTab}`, { name: playthrough.name })}
			/>
			<Tabs
				label={t("tabsLabel")}
				tabs={tabIds.map((id) => ({
					id,
					label: t(`tabs.${id}`),
					count: formatNumber(counts[id]),
				}))}
				activeId={activeTab}
				onChange={setActiveTab}
			>
				{activeTab === "products" && <ProductsTab playthrough={playthrough} />}
				{activeTab === "furniture" && (
					<PriceListTab
						heading={t("furniture.heading", {
							count: formatNumber(market.furnitures.length),
						})}
						note={t("furniture.note")}
						items={market.furnitures}
					/>
				)}
				{activeTab === "paint" && (
					<PriceListTab
						heading={t("paint.heading", { count: formatNumber(market.paints.length) })}
						note={t("paint.note")}
						items={market.paints}
					/>
				)}
				{activeTab === "tools" && <ToolsTab playthrough={playthrough} />}
				{activeTab === "vehicles" && <VehiclesTab playthrough={playthrough} />}
			</Tabs>
		</>
	);
}

export function MarketPage() {
	const t = useTranslations("market");
	return (
		<PlaythroughGate title={t("title")} emptyDescription={t("emptyDescription")}>
			{(playthrough) => (
				<Suspense fallback={null}>
					<MarketContent playthrough={playthrough} />
				</Suspense>
			)}
		</PlaythroughGate>
	);
}
