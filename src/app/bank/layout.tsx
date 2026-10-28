import type { Metadata } from "next";
import RequirePlaythrough from "@/comps/layout/RequirePlaythrough";

export const metadata: Metadata = {
	title: "Bank",
	description:
		"Monitor your Supermarket Simulator financial progress and track budget spending across all store categories.",
	alternates: {
		canonical: "/bank",
	},
	openGraph: {
		title: "Bank | Supermarket Simulator Buddy",
		description:
			"Monitor your Supermarket Simulator financial progress and track budget spending across all store categories.",
		url: "/bank",
	},
};

export default function BankLayout({ children }: { children: React.ReactNode }) {
	return <RequirePlaythrough>{children}</RequirePlaythrough>;
}
