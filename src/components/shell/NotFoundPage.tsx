"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { shellText } from "@/lib/messages/shell";
import { closestPath } from "@/lib/utils/closestPath";
import { HOME_HREF, navGroups, OVERVIEW_HREF, settingsNavItem } from "@/data/nav";
import { ButtonLink } from "@/comps/ui/Button";
import { AppShell } from "./AppShell";

const text = shellText.notFound;
const sections = [...navGroups.flatMap((group) => group.items), settingsNavItem];

export function NotFoundPage() {
	const { activePlaythrough } = usePlaythrough();
	const pathname = usePathname();
	const suggestion = closestPath(
		pathname,
		sections.map((item) => item.href)
	);

	return (
		<AppShell>
			<div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
				<p className="font-brand text-primary text-8xl leading-none font-extrabold italic">
					404
				</p>
				<h1 className="text-2xl font-semibold">{text.title}</h1>
				<p className="text-muted">
					{text.body} <code className="font-mono break-all">{pathname}</code>
				</p>
				{suggestion && (
					<p>
						{text.didYouMean}{" "}
						<Link href={suggestion} className="text-link font-mono underline">
							{suggestion}
						</Link>
					</p>
				)}
				<div className="mt-4 flex flex-wrap justify-center gap-3">
					{activePlaythrough && (
						<ButtonLink href={OVERVIEW_HREF} variant="primary">
							{text.toOverview}
						</ButtonLink>
					)}
					<ButtonLink href={HOME_HREF} variant="secondary">
						{text.toHome}
					</ButtonLink>
				</div>
				<nav
					aria-label={text.quickLinks}
					className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2"
				>
					{sections.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="text-link inline-flex min-h-11 items-center underline lg:min-h-0"
						>
							{item.label}
						</Link>
					))}
				</nav>
			</div>
		</AppShell>
	);
}
