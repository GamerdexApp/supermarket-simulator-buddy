import type { Metadata } from "next";
import { SettingsPage } from "@/comps/settings/SettingsPage";

export const metadata: Metadata = {
	title: "Settings", // i18n-ignore
	description:
		"Export, import or reset your Supermarket Simulator Buddy data and choose a light or dark theme.", // i18n-ignore
	alternates: { canonical: "/settings" },
};

export default function Page() {
	return <SettingsPage />;
}
