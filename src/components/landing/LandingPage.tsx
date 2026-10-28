"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import type { IconType } from "react-icons";
import {
	LuBriefcase,
	LuDownload,
	LuLayers,
	LuListChecks,
	LuMinus,
	LuPlus,
	LuStore,
	LuWallet,
} from "react-icons/lu";
import { formatDate, formatNumber } from "@/lib/format";
import { readStoreLevel } from "@/service/appData";
import { APP_NAME, HOME_HREF, OVERVIEW_HREF } from "@/data/nav";
import { DISCORD_URL, GITHUB_URL } from "@/data/site";
import { CreatePlaythroughDialog } from "@/comps/playthroughs/CreatePlaythroughDialog";
import { Footer } from "@/comps/shell/Footer";
import { Button, ButtonLink } from "@/comps/ui/Button";
import { Card } from "@/comps/ui/Card";
import { SectionLabel } from "@/comps/ui/SectionLabel";
import { useLanding } from "./useLanding";

const STEP_KEYS = ["item1", "item2", "item3"] as const;

const FEATURES: { key: `item${1 | 2 | 3 | 4 | 5 | 6}`; Icon: IconType }[] = [
	{ key: "item1", Icon: LuLayers },
	{ key: "item2", Icon: LuBriefcase },
	{ key: "item3", Icon: LuStore },
	{ key: "item4", Icon: LuWallet },
	{ key: "item5", Icon: LuListChecks },
	{ key: "item6", Icon: LuDownload },
];

const FAQ_KEYS = ["item1", "item2", "item3", "item4", "item5"] as const;

const BRAND_WORD_KEYS = ["item1", "item2", "item3"] as const;

const linkClasses = "flex min-h-11 items-center px-2 hover:underline lg:min-h-9";

type Landing = ReturnType<typeof useLanding>;

function PrimaryAction({ landing }: { landing: Landing }) {
	const t = useTranslations("landing");
	return landing.returning ? (
		<ButtonLink href={OVERVIEW_HREF} variant="primary">
			{t("cta.dashboard")}
		</ButtonLink>
	) : (
		<Button variant="primary" onClick={landing.openCreate}>
			{t("cta.create")}
		</Button>
	);
}

function Header({ landing }: { landing: Landing }) {
	const t = useTranslations("landing");
	const tBrand = useTranslations("shell.brandWords");

	return (
		<header className="border-line bg-surface sticky top-0 z-30 border-b-[1.5px]">
			<div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 lg:px-8">
				<Link href={HOME_HREF} className="flex min-h-11 items-center gap-2.5">
					<Image
						src="/logo.jpg"
						alt=""
						width={36}
						height={36}
						className="block size-9 shrink-0 rounded-md"
					/>
					<span aria-hidden="true" className="flex flex-col">
						{BRAND_WORD_KEYS.map((key) => (
							<span
								key={key}
								className="font-brand text-[13px] leading-[1.05] font-extrabold italic"
							>
								{tBrand(key)}
							</span>
						))}
					</span>
					<span className="sr-only">{APP_NAME}</span>
				</Link>
				<nav
					aria-label={t("header.label")}
					className="ms-auto hidden items-center gap-1 md:flex"
				>
					<a href="#features" className={linkClasses}>
						{t("header.features")}
					</a>
					<a href="#faq" className={linkClasses}>
						{t("header.faq")}
					</a>
					<a
						href={GITHUB_URL}
						target="_blank"
						rel="noopener noreferrer"
						className={linkClasses}
					>
						{t("header.github")}
					</a>
					<a
						href={DISCORD_URL}
						target="_blank"
						rel="noopener noreferrer"
						className={linkClasses}
					>
						{t("header.discord")}
					</a>
				</nav>
				<span className="ms-auto md:ms-3">
					<PrimaryAction landing={landing} />
				</span>
			</div>
		</header>
	);
}

function OverviewPreview() {
	const t = useTranslations("landing");

	return (
		<>
			<Image
				src="/landing/overview-light.png"
				alt={t("hero.preview")}
				width={1280}
				height={800}
				priority
				className="border-line block w-full rounded-md border-[1.5px] dark:hidden"
			/>
			<Image
				src="/landing/overview-dark.png"
				alt={t("hero.preview")}
				width={1280}
				height={800}
				className="border-line hidden w-full rounded-md border-[1.5px] dark:block"
			/>
		</>
	);
}

function Hero({ landing }: { landing: Landing }) {
	const t = useTranslations("landing");
	const active = landing.returning ? landing.activePlaythrough : null;

	return (
		<section className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 pt-12 pb-8 text-center lg:px-8">
			<h1 className="max-w-3xl text-4xl leading-tight font-semibold lg:text-6xl">
				{t.rich("hero.title", {
					accent: (chunks) => <span className="text-primary">{chunks}</span>,
				})}
			</h1>
			<p className="text-muted max-w-2xl text-base lg:text-lg">{t("hero.body")}</p>
			<div className="flex flex-wrap items-center justify-center gap-3">
				<PrimaryAction landing={landing} />
				{landing.returning ? (
					<Button onClick={landing.openCreate}>{t("cta.newPlaythrough")}</Button>
				) : (
					<ButtonLink href="#features" variant="link">
						{t("cta.learn")}
					</ButtonLink>
				)}
			</div>
			{active && (
				<Link href={OVERVIEW_HREF} className="block w-full max-w-md">
					<Card className="hover:bg-tint flex flex-col gap-0.5 p-4 text-start">
						<SectionLabel className="text-muted">
							{t("continueCard.label")}
						</SectionLabel>
						<span className="text-lg font-semibold">{active.name}</span>
						<span className="text-muted">
							{t("continueCard.level", {
								level: formatNumber(readStoreLevel(active)),
							})}{" "}
							· {t("continueCard.updated", { date: formatDate(active.lastModified) })}
						</span>
					</Card>
				</Link>
			)}
			<OverviewPreview />
		</section>
	);
}

function Steps() {
	const t = useTranslations("landing.steps");

	return (
		<section className="bg-tint">
			<div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 lg:px-8">
				<h2 className="text-center text-3xl font-semibold">{t("title")}</h2>
				<ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{STEP_KEYS.map((key, index) => (
						<li key={key} className="flex flex-col items-center gap-2 text-center">
							<span
								aria-hidden="true"
								className="bg-primary text-on-primary flex size-10 items-center justify-center rounded-full font-mono font-medium"
							>
								{formatNumber(index + 1)}
							</span>
							<h3 className="font-semibold">{t(`items.${key}.title`)}</h3>
							<p className="text-muted max-w-xs">{t(`items.${key}.body`)}</p>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}

function Features() {
	const t = useTranslations("landing.features");

	return (
		<section
			id="features"
			className="mx-auto flex max-w-6xl scroll-mt-20 flex-col gap-6 px-4 py-12 lg:px-8"
		>
			<div className="flex flex-col items-center gap-2 text-center">
				<SectionLabel className="text-primary">{t("eyebrow")}</SectionLabel>
				<h2 className="text-3xl font-semibold">{t("title")}</h2>
				<p className="text-muted max-w-2xl">{t("body")}</p>
			</div>
			<ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{FEATURES.map(({ key, Icon }) => (
					<li key={key}>
						<Card className="flex h-full items-start gap-3 p-4">
							<span className="bg-tint text-primary flex size-10 shrink-0 items-center justify-center rounded-md">
								<Icon size={20} aria-hidden="true" />
							</span>
							<div className="flex flex-col gap-1">
								<h3 className="font-semibold">{t(`items.${key}.title`)}</h3>
								<p className="text-muted">{t(`items.${key}.body`)}</p>
							</div>
						</Card>
					</li>
				))}
			</ul>
		</section>
	);
}

/** One answer is open at a time. */
function Faq() {
	const t = useTranslations("landing.faq");
	const [open, setOpen] = useState<number | null>(null);
	const baseId = useId();

	return (
		<section id="faq" className="mx-auto flex max-w-3xl scroll-mt-20 flex-col gap-6 px-4 py-12">
			<h2 className="text-center text-3xl font-semibold">{t("title")}</h2>
			<ul className="flex flex-col gap-2">
				{FAQ_KEYS.map((key, index) => {
					const isOpen = open === index;
					const Icon = isOpen ? LuMinus : LuPlus;
					return (
						<li key={key}>
							<Card className="flex flex-col">
								<h3>
									<button
										type="button"
										aria-expanded={isOpen}
										aria-controls={`${baseId}-${index}`}
										onClick={() => setOpen(isOpen ? null : index)}
										className="flex min-h-13 w-full items-center justify-between gap-3 px-4 py-2 text-start font-semibold"
									>
										{t(`items.${key}.question`)}
										<Icon
											size={18}
											aria-hidden="true"
											className="text-muted shrink-0"
										/>
									</button>
								</h3>
								<div
									id={`${baseId}-${index}`}
									hidden={!isOpen}
									className="text-muted px-4 pb-4"
								>
									{t(`items.${key}.answer`)}
								</div>
							</Card>
						</li>
					);
				})}
			</ul>
		</section>
	);
}

function Closing({ landing }: { landing: Landing }) {
	const t = useTranslations("landing");

	return (
		<section className="bg-tint">
			<div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-12 text-center lg:px-8">
				<h2 className="text-3xl font-semibold">{t("closing.title")}</h2>
				<p className="text-muted">{t("closing.body")}</p>
				<div className="flex flex-wrap justify-center gap-3">
					<PrimaryAction landing={landing} />
					{landing.returning && (
						<Button onClick={landing.openCreate}>{t("cta.newPlaythrough")}</Button>
					)}
				</div>
			</div>
		</section>
	);
}

export function LandingPage() {
	const landing = useLanding();

	return (
		<div className="bg-bg text-ink min-h-dvh">
			<Header landing={landing} />
			<main>
				<Hero landing={landing} />
				<Steps />
				<Features />
				<Faq />
				<Closing landing={landing} />
			</main>
			<Footer />
			<CreatePlaythroughDialog
				open={landing.creating}
				onClose={landing.closeCreate}
				onCreated={landing.onCreated}
			/>
		</div>
	);
}
