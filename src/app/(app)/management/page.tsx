import type { Metadata } from "next";
import { ManagementPage } from "@/comps/management/ManagementPage";

export const metadata: Metadata = {
	title: "Management", // i18n-ignore
	description:
		"Unlock licenses, grow the store and storage section by section, and hire staff in your Supermarket Simulator playthrough.", // i18n-ignore
	alternates: { canonical: "/management" },
};

export default function Page() {
	return <ManagementPage />;
}
