import type { Metadata } from "next";
import { ShoppingListPage } from "@/comps/shopping/ShoppingListPage";

export const metadata: Metadata = {
	title: "Shopping List", // i18n-ignore
	description: "Plan which Supermarket Simulator products to buy, grouped by shop.", // i18n-ignore
	alternates: { canonical: "/shopping-list" },
};

export default function Page() {
	return <ShoppingListPage />;
}
