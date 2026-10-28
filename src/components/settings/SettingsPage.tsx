"use client";

import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { useUrlTab } from "@/lib/hooks/useUrlTab";
import { PageHeader } from "@/comps/shell/PageHeader";
import { Tabs } from "@/comps/ui/Tabs";
import { AboutTab } from "./AboutTab";
import { DataTab } from "./DataTab";
import { PreferencesTab } from "./PreferencesTab";
import { SyncTab } from "./SyncTab";

const tabIds = ["sync", "preferences", "data", "about"] as const;

function SettingsContent() {
	const t = useTranslations("settings");
	const [activeTab, setActiveTab] = useUrlTab(tabIds, "sync");

	return (
		<>
			<PageHeader title={t("title")} subline={t("subline")} />
			<Tabs
				label={t("tabsLabel")}
				tabs={tabIds.map((id) => ({ id, label: t(`tabs.${id}`) }))}
				activeId={activeTab}
				onChange={setActiveTab}
			>
				{activeTab === "sync" && <SyncTab />}
				{activeTab === "preferences" && <PreferencesTab />}
				{activeTab === "data" && <DataTab />}
				{activeTab === "about" && <AboutTab />}
			</Tabs>
		</>
	);
}

export function SettingsPage() {
	return (
		<Suspense fallback={null}>
			<SettingsContent />
		</Suspense>
	);
}
