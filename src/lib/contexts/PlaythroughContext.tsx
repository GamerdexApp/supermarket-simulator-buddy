"use client";

import React, { createContext, useContext, useState, useSyncExternalStore } from "react";
import type { AppData, PlaythroughContextType } from "@/types";
import { useIsHydrated } from "@/lib/hooks/useIsHydrated";
import * as appData from "@/service/appData";
import { storageService } from "@/service/storage";

const PlaythroughContext = createContext<PlaythroughContextType | undefined>(undefined);

export function PlaythroughProvider({ children }: { children: React.ReactNode }) {
	const data = useSyncExternalStore(
		storageService.subscribe,
		storageService.load,
		storageService.loadOnServer
	);
	const isLoaded = useIsHydrated();
	const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
	const [saveFailed, setSaveFailed] = useState(false);

	const updateData: PlaythroughContextType["updateData"] = (update) => {
		const previous = storageService.load();
		const saved = storageService.save(update(previous));

		setSaveFailed(!saved);
		if (saved) setLastSavedAt(new Date());
		return saved ? previous : null;
	};

	const activePlaythrough =
		data.playthroughs.find((p) => p.id === data.activePlaythroughId) ?? null;

	const setActivePlaythrough: PlaythroughContextType["setActivePlaythrough"] = (id) => {
		updateData((current) => appData.setActivePlaythrough(current, id));
	};

	const addPlaythrough: PlaythroughContextType["addPlaythrough"] = (input) => {
		const id = crypto.randomUUID();
		const saved = updateData((current) =>
			appData.addPlaythrough(current, input, new Date(), id)
		);
		return saved ? id : null;
	};

	const updatePlaythrough: PlaythroughContextType["updatePlaythrough"] = (id, updates) => {
		updateData((current) => appData.updatePlaythrough(current, id, updates));
	};

	const deletePlaythrough: PlaythroughContextType["deletePlaythrough"] = (id) =>
		updateData((current) => appData.deletePlaythrough(current, id));

	return (
		<PlaythroughContext.Provider
			value={{
				appData: data as AppData,
				playthroughs: data.playthroughs,
				activePlaythrough,
				isLoaded,
				lastSavedAt,
				saveFailed,
				updateData,
				setActivePlaythrough,
				addPlaythrough,
				updatePlaythrough,
				deletePlaythrough,
			}}
		>
			{children}
		</PlaythroughContext.Provider>
	);
}

export function usePlaythrough() {
	const context = useContext(PlaythroughContext);
	if (context === undefined) {
		throw new Error("usePlaythrough must be used within a PlaythroughProvider"); // i18n-ignore
	}
	return context;
}
