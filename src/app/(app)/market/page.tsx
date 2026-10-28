import type { Metadata } from "next";
import { MarketPage } from "@/comps/market/MarketPage";

export const metadata: Metadata = {
	title: "Market", // i18n-ignore
	description:
		"Browse Supermarket Simulator products, furniture and paint, and track the tools and vehicles you own.", // i18n-ignore
	alternates: { canonical: "/market" },
};

export default function Page() {
	return <MarketPage />;
}
