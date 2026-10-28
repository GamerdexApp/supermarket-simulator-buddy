"use client";

import { TabItem, Tabs } from "flowbite-react";
import { redirect } from "next/navigation";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { CustomizationsTab } from "./CustomizationsTab";
import { GrowthTab } from "./GrowthTab";
import { HiringTab } from "./HiringTab";
import { LicensesTab } from "./LicensesTab";
import { StorageTab } from "./StorageTab";

export default function ManagementPage() {
	const { activePlaythrough, updatePlaythrough } = usePlaythrough();

	if (!activePlaythrough) {
		redirect("/");
	}

	const unlockedLicenses = activePlaythrough.unlockedLicenses || [];
	const unlockedGrowth = activePlaythrough.unlockedGrowth || [];
	const unlockedStorage = activePlaythrough.unlockedStorage || [];
	const hiredEmployees = activePlaythrough.hiredEmployees || [];

	const handleUnlockLicense = (licenseId: string) => {
		updatePlaythrough(activePlaythrough.id, {
			unlockedLicenses: [...unlockedLicenses, licenseId],
		});
	};

	const handleLockLicense = (licenseId: string) => {
		updatePlaythrough(activePlaythrough.id, {
			unlockedLicenses: unlockedLicenses.filter((id) => id !== licenseId),
		});
	};

	const handleUnlockGrowth = (sectionNum: string) => {
		updatePlaythrough(activePlaythrough.id, {
			unlockedGrowth: [...unlockedGrowth, sectionNum],
		});
	};

	const handleLockGrowth = (sectionNum: string) => {
		updatePlaythrough(activePlaythrough.id, {
			unlockedGrowth: unlockedGrowth.filter((id) => id !== sectionNum),
		});
	};

	const handleUnlockStorage = (sectionNum: string) => {
		updatePlaythrough(activePlaythrough.id, {
			unlockedStorage: [...unlockedStorage, sectionNum],
		});
	};

	const handleLockStorage = (sectionNum: string) => {
		updatePlaythrough(activePlaythrough.id, {
			unlockedStorage: unlockedStorage.filter((id) => id !== sectionNum),
		});
	};

	const handleHireEmployee = (employeeId: string) => {
		updatePlaythrough(activePlaythrough.id, {
			hiredEmployees: [...hiredEmployees, employeeId],
		});
	};

	const handleFireEmployee = (employeeId: string) => {
		updatePlaythrough(activePlaythrough.id, {
			hiredEmployees: hiredEmployees.filter((id) => id !== employeeId),
		});
	};

	return (
		<main className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
			<div className="mx-auto">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white">Management</h1>
					<p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
						Manage licenses, growth, storage, hiring, and customizations for{" "}
						{activePlaythrough.name}
					</p>
				</div>

				<Tabs aria-label="Management tabs" variant="underline">
					<TabItem active title="Licenses">
						<LicensesTab
							activePlaythrough={activePlaythrough}
							onUnlockLicense={handleUnlockLicense}
							onLockLicense={handleLockLicense}
						/>
					</TabItem>

					<TabItem title="Growth">
						<GrowthTab
							activePlaythrough={activePlaythrough}
							onUnlockGrowth={handleUnlockGrowth}
							onLockGrowth={handleLockGrowth}
						/>
					</TabItem>

					<TabItem title="Storage">
						<StorageTab
							activePlaythrough={activePlaythrough}
							onUnlockStorage={handleUnlockStorage}
							onLockStorage={handleLockStorage}
						/>
					</TabItem>

					<TabItem title="Hiring">
						<HiringTab
							activePlaythrough={activePlaythrough}
							onHireEmployee={handleHireEmployee}
							onFireEmployee={handleFireEmployee}
						/>
					</TabItem>

					<TabItem title="Customizations">
						<CustomizationsTab />
					</TabItem>
				</Tabs>
			</div>
		</main>
	);
}
