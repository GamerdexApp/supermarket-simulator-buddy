"use client";

import { Button, Navbar, NavbarBrand } from "flowbite-react";
import Image from "next/image";
import { HiMenu, HiMoon, HiSun, HiX } from "react-icons/hi";
import { useUI } from "@/lib/contexts/UIContext";
import { setTheme } from "@/lib/theme";

/** Writes the new theme key, so the old top bar and the new Settings choice agree. */
const toggleTheme = () =>
	setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");

export function AppNavbar() {
	const { sidebarOpen, toggleSidebar } = useUI();

	return (
		<Navbar fluid className="border-b border-gray-200 dark:border-gray-700">
			<div className="flex items-center gap-3">
				<Button onClick={toggleSidebar} size="sm" className="mr-4 md:hidden">
					{sidebarOpen ? <HiX className="size-6" /> : <HiMenu className="size-6" />}
					<span className="sr-only">Toggle sidebar</span>
				</Button>
				<NavbarBrand>
					<Image
						src="/logo.jpg"
						alt="Supermarket Simulator"
						width={40}
						height={40}
						className="mr-3 rounded-lg"
					/>
					<span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
						Supermarket Simulator Buddy
					</span>
				</NavbarBrand>
			</div>
			<div className="flex md:order-2">
				<button
					type="button"
					onClick={toggleTheme}
					aria-label="Toggle dark mode"
					className="rounded-lg p-2.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
				>
					<HiMoon className="size-5 dark:hidden" />
					<HiSun className="hidden size-5 dark:block" />
				</button>
			</div>
		</Navbar>
	);
}
