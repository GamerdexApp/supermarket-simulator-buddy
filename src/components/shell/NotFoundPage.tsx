"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { closestPath } from "@/lib/utils/closestPath";
import { HOME_HREF, navGroups, OVERVIEW_HREF, settingsNavItem } from "@/data/nav";
import { ButtonLink } from "@/comps/ui/Button";
import { AppShell } from "./AppShell";

const sections = [...navGroups.flatMap((group) => group.items), settingsNavItem];

export function NotFoundPage() {
	const t = useTranslations("shell");
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
				<h1 className="text-2xl font-semibold">{t("notFound.title")}</h1>
				<p className="text-muted">
					{t.rich("notFound.body", {
						path: pathname,
						code: (chunks) => <code className="font-mono break-all">{chunks}</code>,
					})}
				</p>
				{suggestion && (
					<p>
						{t.rich("notFound.didYouMean", {
							suggestion,
							link: (chunks) => (
								<Link href={suggestion} className="text-link font-mono underline">
									{chunks}
								</Link>
							),
						})}
					</p>
				)}
				<div className="mt-4 flex flex-wrap justify-center gap-3">
					{activePlaythrough && (
						<ButtonLink href={OVERVIEW_HREF} variant="primary">
							{t("notFound.toOverview")}
						</ButtonLink>
					)}
					<ButtonLink href={HOME_HREF} variant="secondary">
						{t("notFound.toHome")}
					</ButtonLink>
				</div>
				<nav
					aria-label={t("notFound.quickLinks")}
					className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2"
				>
					{sections.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="text-link inline-flex min-h-11 items-center underline lg:min-h-0"
						>
							{t(`nav.items.${item.id}`)}
						</Link>
					))}
				</nav>
			</div>
		</AppShell>
	);
}
