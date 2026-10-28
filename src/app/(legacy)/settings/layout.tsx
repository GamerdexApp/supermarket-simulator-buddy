import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Settings",
	description:
		"Export, import, or clear your Supermarket Simulator Buddy playthrough data. Backup your progress as JSON anytime.",
	alternates: {
		canonical: "/settings",
	},
	openGraph: {
		title: "Settings | Supermarket Simulator Buddy",
		description:
			"Export, import, or clear your Supermarket Simulator Buddy playthrough data. Backup your progress as JSON anytime.",
		url: "/settings",
	},
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
	return children;
}
