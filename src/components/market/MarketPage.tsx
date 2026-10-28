"use client";

import { Suspense } from "react";
import type { Playthrough } from "@/types/playthrough";
import { formatMoney } from "@/lib/format";
import { useUrlTab } from "@/lib/hooks/useUrlTab";
import { marketText } from "@/lib/messages/market";
import { readStoreLevel } from "@/service/appData";
import { ownedLicenseCount, toolState, vehicleState } from "@/service/market";
import { market } from "@/data/supermarket-simulator/market";
import { PageHeader } from "@/comps/shell/PageHeader";
import { PlaythroughGate } from "@/comps/shell/PlaythroughGate";
import { Tabs } from "@/comps/ui/Tabs";
import { OwnedItemsTab } from "./OwnedItemsTab";
import { PriceListTab } from "./PriceListTab";
import { ProductsTab } from "./ProductsTab";

const text = marketText;
const tabIds = ["products", "furniture", "paint", "tools", "vehicles"] as const;

const counts = {
	products: market.products.length,
	furniture: market.furnitures.length,
	paint: market.paints.length,
	tools: market.tools.length,
	vehicles: market.vehicles.length,
};

const priceText = (price: number) => (price === 0 ? text.free : formatMoney(price));

function ToolsTab({ playthrough }: { playthrough: Playthrough }) {
	const owned = ownedLicenseCount(playthrough);
	return (
		<OwnedItemsTab
			playthrough={playthrough}
			field="unlockedTools"
			items={market.tools.map((tool) => ({
				...tool,
				state: toolState(tool, playthrough),
				lockReason: tool.requiredLicenses
					? text.tools.requiresLicenses(tool.requiredLicenses, owned)
					: undefined,
			}))}
			totalSpentLabel={text.tools.totalSpent}
			unlockedOf={text.tools.unlockedOf}
			unlockedToast={text.tools.unlocked}
			undoneToast={text.tools.undone}
		/>
	);
}

function VehiclesTab({ playthrough }: { playthrough: Playthrough }) {
	const level = readStoreLevel(playthrough);
	return (
		<OwnedItemsTab
			playthrough={playthrough}
			field="unlockedVehicles"
			items={market.vehicles.map((vehicle) => ({
				...vehicle,
				state: vehicleState(vehicle, playthrough),
				facts: [
					{ label: text.vehicles.price, value: priceText(vehicle.unitPrice) },
					{ label: text.vehicles.storeLevel, value: String(vehicle.storeLevel) },
				],
				lockReason: text.vehicles.requiresLevel(vehicle.storeLevel, level),
			}))}
			totalSpentLabel={text.vehicles.totalSpent}
			unlockedOf={text.vehicles.unlockedOf}
			unlockedToast={text.vehicles.unlocked}
			undoneToast={text.vehicles.undone}
		/>
	);
}

function MarketContent({ playthrough }: { playthrough: Playthrough }) {
	const [activeTab, setActiveTab] = useUrlTab(tabIds, "products");

	return (
		<>
			<PageHeader title={text.title} subline={text.sublines[activeTab](playthrough.name)} />
			<Tabs
				label={text.tabsLabel}
				tabs={tabIds.map((id) => ({ id, label: text.tabs[id], count: counts[id] }))}
				activeId={activeTab}
				onChange={setActiveTab}
			>
				{activeTab === "products" && <ProductsTab playthrough={playthrough} />}
				{activeTab === "furniture" && (
					<PriceListTab
						heading={text.furniture.heading(market.furnitures.length)}
						note={text.furniture.note}
						items={market.furnitures}
					/>
				)}
				{activeTab === "paint" && (
					<PriceListTab
						heading={text.paint.heading(market.paints.length)}
						note={text.paint.note}
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
	return (
		<PlaythroughGate title={text.title} emptyDescription={text.emptyDescription}>
			{(playthrough) => (
				<Suspense fallback={null}>
					<MarketContent playthrough={playthrough} />
				</Suspense>
			)}
		</PlaythroughGate>
	);
}
