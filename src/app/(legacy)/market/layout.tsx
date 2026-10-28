import type { Metadata } from "next";
import RequirePlaythrough from "@/comps/layout/RequirePlaythrough";

export const metadata: Metadata = {
	title: "Market",
	description:
		"Browse and track products, tools, vehicles, furniture, and paint available for your Supermarket Simulator store.",
	alternates: {
		canonical: "/market",
	},
	openGraph: {
		title: "Market | Supermarket Simulator Buddy",
		description:
			"Browse and track products, tools, vehicles, furniture, and paint available for your Supermarket Simulator store.",
		url: "/market",
	},
};

export default function MarketLayout({ children }: { children: React.ReactNode }) {
	return <RequirePlaythrough>{children}</RequirePlaythrough>;
}
