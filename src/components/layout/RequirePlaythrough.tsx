"use client";

import { redirect } from "next/navigation";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";

/** Renders nothing until the saved data is read, so a refresh does not bounce to the landing page. */
export default function RequirePlaythrough({ children }: { children: React.ReactNode }) {
	const { isLoaded, activePlaythrough } = usePlaythrough();

	if (!isLoaded) return null;
	if (!activePlaythrough) redirect("/");
	return children;
}
