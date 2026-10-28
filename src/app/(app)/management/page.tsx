import type { Metadata } from "next";
import { ManagementPage } from "@/comps/management/ManagementPage";

export const metadata: Metadata = {
	title: "Management",
	description:
		"Unlock licenses, grow the store and storage section by section, and hire staff in your Supermarket Simulator playthrough.",
	alternates: { canonical: "/management" },
};

export default function Page() {
	return <ManagementPage />;
}
