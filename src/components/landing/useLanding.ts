"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { OVERVIEW_HREF } from "@/data/nav";

/**
 * A visitor with a saved playthrough sees the way to the dashboard, a new visitor sees how to
 * start. The page never redirects. Creating a playthrough here opens the Overview.
 */
export function useLanding() {
  const { isLoaded, playthroughs, activePlaythrough } = usePlaythrough();
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  return {
    returning: isLoaded && playthroughs.length > 0,
    activePlaythrough,
    creating,
    openCreate: () => setCreating(true),
    closeCreate: () => setCreating(false),
    onCreated: () => router.push(OVERVIEW_HREF),
  };
}
