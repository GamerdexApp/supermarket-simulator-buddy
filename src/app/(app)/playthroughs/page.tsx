import type { Metadata } from "next";
import { Suspense } from "react";
import { PlaythroughsPage } from "@/comps/playthroughs/PlaythroughsPage";

export const metadata: Metadata = {
	title: "Playthroughs",
	description: "Create, switch, edit and delete your Supermarket Simulator playthroughs.",
	alternates: { canonical: "/playthroughs" },
};

export default function Page() {
	return (
		<Suspense>
			<PlaythroughsPage />
		</Suspense>
	);
}
