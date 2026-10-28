"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { UIContextType } from "@/types";

const UIContext = createContext<UIContextType | undefined>(undefined);

const DESKTOP_QUERY = "(min-width: 1024px)";

export function UIProvider({ children }: { children: React.ReactNode }) {
	const [drawerOpen, setDrawerOpen] = useState(false);

	// The drawer opens only from the menu button. Growing past the drawer breakpoint closes it,
	// because the fixed sidebar takes its place.
	useEffect(() => {
		const desktop = window.matchMedia(DESKTOP_QUERY);
		const closeOnDesktop = () => {
			if (desktop.matches) setDrawerOpen(false);
		};
		desktop.addEventListener("change", closeOnDesktop);
		return () => desktop.removeEventListener("change", closeOnDesktop);
	}, []);

	return (
		<UIContext.Provider
			value={{
				drawerOpen,
				openDrawer: () => setDrawerOpen(true),
				closeDrawer: () => setDrawerOpen(false),
			}}
		>
			{children}
		</UIContext.Provider>
	);
}

export function useUI() {
	const context = useContext(UIContext);
	if (context === undefined) {
		throw new Error("useUI must be used within a UIProvider"); // i18n-ignore
	}
	return context;
}
