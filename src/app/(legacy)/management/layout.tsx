import type { Metadata } from "next";
import RequirePlaythrough from "@/comps/layout/RequirePlaythrough";

export const metadata: Metadata = {
	title: "Management",
	description:
		"Manage your Supermarket Simulator store — track product licenses, store growth, storage sections, hiring, and customizations.",
	alternates: {
		canonical: "/management",
	},
	openGraph: {
		title: "Management | Supermarket Simulator Buddy",
		description:
			"Manage your Supermarket Simulator store — track product licenses, store growth, storage sections, hiring, and customizations.",
		url: "/management",
	},
};

export default function ManagementLayout({ children }: { children: React.ReactNode }) {
	return <RequirePlaythrough>{children}</RequirePlaythrough>;
}
