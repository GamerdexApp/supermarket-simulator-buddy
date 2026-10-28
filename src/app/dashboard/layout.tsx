import type { Metadata } from "next";
import RequirePlaythrough from "@/comps/layout/RequirePlaythrough";

export const metadata: Metadata = {
	title: "Dashboard",
	description:
		"View and manage your active Supermarket Simulator playthrough. Track store level, progress, and key stats at a glance.",
	alternates: {
		canonical: "/dashboard",
	},
	openGraph: {
		title: "Dashboard | Supermarket Simulator Buddy",
		description:
			"View and manage your active Supermarket Simulator playthrough. Track store level, progress, and key stats at a glance.",
		url: "/dashboard",
	},
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return <RequirePlaythrough>{children}</RequirePlaythrough>;
}
