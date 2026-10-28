"use client";

import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { managementText } from "@/lib/messages/management";
import type { UnlockListField } from "@/service/appData";
import {
  addToList,
  removeFromList,
  updatePlaythrough,
} from "@/service/appData";
import { useToast } from "@/comps/ui/Toast";

/**
 * Adds or removes ids in one unlock list of a playthrough, saves at once and offers Undo. Undo puts
 * back only that list, so edits made since then to other lists or playthroughs stay.
 */
export function useListEdit(playthroughId: string, field: UnlockListField) {
  const { updateData } = usePlaythrough();
  const showToast = useToast();

  const apply = (change: "add" | "remove", ids: string[], title: string) => {
    const previous = updateData((current) =>
      change === "add"
        ? addToList(current, playthroughId, field, ids)
        : removeFromList(current, playthroughId, field, ids),
    );
    if (!previous) return;
    const previousList = previous.playthroughs.find(
      (p) => p.id === playthroughId,
    )?.[field];
    showToast({
      variant: "success",
      title,
      action: {
        label: managementText.undo,
        onAction: () =>
          updateData((current) =>
            updatePlaythrough(current, playthroughId, {
              [field]: previousList,
            }),
          ),
      },
    });
  };

  return {
    add: (ids: string[], title: string) => apply("add", ids, title),
    remove: (ids: string[], title: string) => apply("remove", ids, title),
  };
}
