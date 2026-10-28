import { useTranslations } from "next-intl";
import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";
import { APP_NAME, SETTINGS_HREF } from "@/data/nav";
import { DISCORD_URL, GAMERDEX_URL, GITHUB_URL, OFFICIAL_GAME_URL } from "@/data/site";
import { SectionLabel } from "@/comps/ui/SectionLabel";
import { BrandMark } from "./BrandMark";

const linkClasses = "flex min-h-11 items-center gap-1 hover:underline md:min-h-9";

function ExternalLink({
	href,
	children,
	sameTab = false,
}: {
	href: string;
	children: string;
	sameTab?: boolean;
}) {
	return (
		<a
			href={href}
			{...(sameTab ? {} : { target: "_blank", rel: "noopener noreferrer" })}
			className={linkClasses}
		>
			{children}
			<LuArrowUpRight size={14} aria-hidden="true" className="shrink-0" />
		</a>
	);
}

export function Footer() {
	const t = useTranslations("shell.footer");
	return (
		<footer className="bg-primary text-on-primary flex flex-col gap-6 px-4 pt-10 pb-7 [--ring:var(--color-on-primary)] lg:px-8">
			<div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-[1.4fr_1fr_1.2fr] md:gap-8">
				<div className="col-span-2 flex min-w-0 flex-col gap-3 md:col-span-1">
					<span className="bg-sb-bg w-fit rounded-md px-3 py-2 [--ring:var(--color-sb-ring)]">
						<BrandMark />
					</span>
					<span className="max-w-sm">{t("tagline")}</span>
				</div>
				<nav aria-label={t("support")} className="flex min-w-0 flex-col gap-1.5">
					<SectionLabel className="text-on-primary">{t("support")}</SectionLabel>
					<Link href={SETTINGS_HREF} className={linkClasses}>
						{t("settings")}
					</Link>
					<ExternalLink href={DISCORD_URL}>{t("discord")}</ExternalLink>
					<ExternalLink href={GITHUB_URL}>{t("github")}</ExternalLink>
					<ExternalLink href={`${GAMERDEX_URL}/privacy`} sameTab>
						{t("privacy")}
					</ExternalLink>
					<ExternalLink href={`${GAMERDEX_URL}/terms`} sameTab>
						{t("terms")}
					</ExternalLink>
				</nav>
				<div className="contents md:flex md:min-w-0 md:flex-col md:gap-3">
					<nav aria-label={t("about")} className="flex min-w-0 flex-col gap-1.5">
						<SectionLabel className="text-on-primary">{t("about")}</SectionLabel>
						<ExternalLink href={OFFICIAL_GAME_URL}>{t("officialGame")}</ExternalLink>
					</nav>
					<div className="border-on-primary/40 col-span-2 flex flex-col gap-1 rounded-md border-[1.5px] px-3.5 py-3 md:col-span-1">
						<span className="font-semibold">{t("disclaimerTitle")}</span>
						<span className="text-[13px]">{t("disclaimer")}</span>
					</div>
				</div>
			</div>
			<div className="border-on-primary/40 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t-[1.5px] pt-4 text-[13px]">
				<span>
					© {new Date().getFullYear()} {APP_NAME}
				</span>
				<span className="flex flex-wrap items-center gap-x-3">
					{t("framework")}
					<ExternalLink href={GAMERDEX_URL}>{t("visitGamerdex")}</ExternalLink>
				</span>
			</div>
		</footer>
	);
}
