import type { Metadata } from "next";
import { BankPage } from "@/comps/bank/BankPage";

export const metadata: Metadata = {
	title: "Bank", // i18n-ignore
	description:
		"Track the loans of your Supermarket Simulator playthrough, with interest and daily payments.", // i18n-ignore
	alternates: { canonical: "/bank" },
};

export default function Page() {
	return <BankPage />;
}
