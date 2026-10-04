import { ThemeModeScript } from "flowbite-react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { PlaythroughProvider } from "@/lib/contexts/PlaythroughContext";
import { UIProvider } from "@/lib/contexts/UIContext";
import { LayoutWrapper } from "@/comps/layout/LayoutWrapper";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const SITE_URL = "https://supermarket-simulator.gamerdex.app";

const SITE_DESCRIPTION =
	"The ultimate companion app for Supermarket Simulator. Track progress across multiple playthroughs, manage licenses, monitor budgets, and build your supermarket empire.";

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: "Supermarket Simulator Buddy",
		template: "%s | Supermarket Simulator Buddy",
	},
	description: SITE_DESCRIPTION,
	keywords: [
		"Supermarket Simulator",
		"progress tracker",
		"game companion",
		"playthroughs",
		"license manager",
		"budget tracker",
		"store management",
		"supermarket game",
	],
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "/",
		title: "Supermarket Simulator Buddy",
		description: SITE_DESCRIPTION,
		siteName: "Supermarket Simulator Buddy",
		images: [
			{
				url: "/screenshot.png",
				width: 2432,
				height: 1442,
				alt: "Supermarket Simulator Buddy — app screenshot",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Supermarket Simulator Buddy",
		description: SITE_DESCRIPTION,
		images: ["/screenshot.png"],
	},
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
		],
		apple: "/apple-touch-icon.png",
	},
	manifest: "/site.webmanifest",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning className="h-full">
			<head>
				<ThemeModeScript />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gray-50 antialiased dark:bg-gray-900`}
			>
				<UIProvider>
					<PlaythroughProvider>
						<LayoutWrapper>{children}</LayoutWrapper>
					</PlaythroughProvider>
				</UIProvider>

				<Script
					defer
					src="https://static.cloudflareinsights.com/beacon.min.js"
					data-cf-beacon='{"token": "6004659b06fb403dacb4dffb9543e35a"}'
					strategy="afterInteractive"
				/>
			</body>
		</html>
	);
}
