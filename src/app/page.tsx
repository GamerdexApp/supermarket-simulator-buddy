import type { Metadata } from "next";
import { LandingPage } from "@/comps/landing/LandingPage";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Page() {
	return <LandingPage />;
}
