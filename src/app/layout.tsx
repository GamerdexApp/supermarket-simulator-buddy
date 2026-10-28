import { I18nProvider } from "@/i18n/I18nProvider";
import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Poppins } from "next/font/google";
import Script from "next/script";
import { PlaythroughProvider } from "@/lib/contexts/PlaythroughContext";
import { UIProvider } from "@/lib/contexts/UIContext";
import { applyThemeBeforePaint } from "@/lib/themeScript";
import { ThemeSync } from "@/comps/layout/ThemeSync";
import { ToastProvider } from "@/comps/ui/Toast";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
	variable: "--font-plex-sans",
	subsets: ["latin"],
	weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
	variable: "--font-plex-mono",
	subsets: ["latin"],
	weight: ["400", "500"],
});

const poppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	weight: "800",
	style: "italic",
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
		<html
			lang="en"
			suppressHydrationWarning
			className={`${plexSans.variable} ${plexMono.variable} ${poppins.variable} h-full`}
		>
			<head>
				<script dangerouslySetInnerHTML={{ __html: applyThemeBeforePaint }} />
			</head>
			<body className="bg-bg min-h-dvh antialiased">
				<I18nProvider>
					<UIProvider>
						<ToastProvider>
							<PlaythroughProvider>
								<ThemeSync />
								{children}
							</PlaythroughProvider>
						</ToastProvider>
					</UIProvider>
				</I18nProvider>

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
