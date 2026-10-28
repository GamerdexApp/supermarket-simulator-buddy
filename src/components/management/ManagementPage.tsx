"use client";

import { Suspense } from "react";
import type { Playthrough } from "@/types/playthrough";
import { useUrlTab } from "@/lib/hooks/useUrlTab";
import { managementText } from "@/lib/messages/management";
import { allEmployees, countKnown, sectionsOf } from "@/service/management";
import { management } from "@/data/supermarket-simulator/management";
import { PageHeader } from "@/comps/shell/PageHeader";
import { PlaythroughGate } from "@/comps/shell/PlaythroughGate";
import { Tabs } from "@/comps/ui/Tabs";
import { CustomizationsTab } from "./CustomizationsTab";
import { HiringTab } from "./HiringTab";
import { LicensesTab } from "./LicensesTab";
import { SectionPathTab } from "./SectionPathTab";

const text = managementText;
const tabIds = ["licenses", "growth", "storage", "hiring", "customizations"] as const;
type TabId = (typeof tabIds)[number];

const ids = {
	licenses: management.licenses.map((license) => license.id),
	growth: sectionsOf("growth").map((section) => section.sectionNum),
	storage: sectionsOf("storage").map((section) => section.sectionNum),
	hiring: allEmployees.map((employee) => employee.id),
};

const tabCount = (id: TabId, playthrough: Playthrough): string => {
	if (id === "customizations") return String(management.customizations.length);
	const owned = {
		licenses: playthrough.unlockedLicenses,
		growth: playthrough.unlockedGrowth,
		storage: playthrough.unlockedStorage,
		hiring: playthrough.hiredEmployees,
	}[id];
	return `${countKnown(owned, ids[id])} / ${ids[id].length}`;
};

function ManagementContent({ playthrough }: { playthrough: Playthrough }) {
	const [activeTab, setActiveTab] = useUrlTab(tabIds, "licenses");

	return (
		<>
			<PageHeader title={text.title} subline={text.sublines[activeTab](playthrough.name)} />
			<Tabs
				label={text.tabsLabel}
				tabs={tabIds.map((id) => ({
					id,
					label: text.tabs[id],
					count: tabCount(id, playthrough),
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
	return (
		<PlaythroughGate title={text.title} emptyDescription={text.emptyDescription}>
			{(playthrough) => (
				<Suspense fallback={null}>
					<ManagementContent playthrough={playthrough} />
				</Suspense>
			)}
		</PlaythroughGate>
	);
}
