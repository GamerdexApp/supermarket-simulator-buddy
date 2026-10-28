"use client";

import { useTranslations } from "next-intl";
import { Suspense } from "react";
import type { Playthrough } from "@/types/playthrough";
import { formatNumber } from "@/lib/format";
import { useUrlTab } from "@/lib/hooks/useUrlTab";
import { allEmployees, countKnown, sectionsOf } from "@/service/management";
import { management } from "@/data/supermarket-simulator/management";
import { PageHeader } from "@/comps/shell/PageHeader";
import { PlaythroughGate } from "@/comps/shell/PlaythroughGate";
import { Tabs } from "@/comps/ui/Tabs";
import { CustomizationsTab } from "./CustomizationsTab";
import { HiringTab } from "./HiringTab";
import { LicensesTab } from "./LicensesTab";
import { SectionPathTab } from "./SectionPathTab";

const tabIds = ["licenses", "growth", "storage", "hiring", "customizations"] as const;
type TabId = (typeof tabIds)[number];

const ids = {
	licenses: management.licenses.map((license) => license.id),
	growth: sectionsOf("growth").map((section) => section.sectionNum),
	storage: sectionsOf("storage").map((section) => section.sectionNum),
	hiring: allEmployees.map((employee) => employee.id),
};

type OwnedTabId = keyof typeof ids;

const ownedCount = (id: OwnedTabId, playthrough: Playthrough) => {
	const owned = {
		licenses: playthrough.unlockedLicenses,
		growth: playthrough.unlockedGrowth,
		storage: playthrough.unlockedStorage,
		hiring: playthrough.hiredEmployees,
	}[id];
	return countKnown(owned, ids[id]);
};

function ManagementContent({ playthrough }: { playthrough: Playthrough }) {
	const t = useTranslations("management");
	const [activeTab, setActiveTab] = useUrlTab(tabIds, "licenses");
	const tabCount = (id: TabId) =>
		id === "customizations"
			? formatNumber(management.customizations.length)
			: t("tabCount", {
					owned: formatNumber(ownedCount(id, playthrough)),
					total: formatNumber(ids[id].length),
				});

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
					count: tabCount(id),
				}))}
				activeId={activeTab}
				onChange={setActiveTab}
			>
				{activeTab === "licenses" && <LicensesTab playthrough={playthrough} />}
				{activeTab === "growth" && (
					<SectionPathTab kind="growth" playthrough={playthrough} />
				)}
				{activeTab === "storage" && (
					<SectionPathTab kind="storage" playthrough={playthrough} />
				)}
				{activeTab === "hiring" && <HiringTab playthrough={playthrough} />}
				{activeTab === "customizations" && <CustomizationsTab />}
			</Tabs>
		</>
	);
}

export function ManagementPage() {
	const t = useTranslations("management");
	return (
		<PlaythroughGate title={t("title")} emptyDescription={t("emptyDescription")}>
			{(playthrough) => (
				<Suspense fallback={null}>
					<ManagementContent playthrough={playthrough} />
				</Suspense>
			)}
		</PlaythroughGate>
	);
}
