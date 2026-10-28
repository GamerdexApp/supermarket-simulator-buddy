import type { Metadata } from "next";
import { BankPage } from "@/comps/bank/BankPage";

export const metadata: Metadata = {
	title: "Bank",
	description:
		"Track the loans of your Supermarket Simulator playthrough, with interest and daily payments.",
	alternates: { canonical: "/bank" },
};

export default function Page() {
	return <BankPage />;
}
