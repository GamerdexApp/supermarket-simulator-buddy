import type { Metadata } from "next";
import { OverviewPage } from "@/comps/overview/OverviewPage";

export const metadata: Metadata = {
	title: "Overview", // i18n-ignore
	description:
		"See your active Supermarket Simulator playthrough at a glance: store level, loans, total investment and progress.", // i18n-ignore
	alternates: { canonical: "/overview" },
};

export default function Page() {
	return <OverviewPage />;
}
