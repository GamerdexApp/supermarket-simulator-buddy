import type { Metadata } from "next";
import { ShoppingListPage } from "@/comps/shopping/ShoppingListPage";

export const metadata: Metadata = {
	title: "Shopping List",
	description: "Plan which Supermarket Simulator products to buy, grouped by shop.",
	alternates: { canonical: "/shopping-list" },
};

export default function Page() {
	return <ShoppingListPage />;
}
