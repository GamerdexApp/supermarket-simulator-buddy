"use client";

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
import { formatDate } from "@/lib/format";
import { landingText } from "@/lib/messages/landing";
import { shellText } from "@/lib/messages/shell";
import { readStoreLevel } from "@/service/appData";
import { APP_NAME, HOME_HREF, OVERVIEW_HREF } from "@/data/nav";
import { DISCORD_URL, GITHUB_URL } from "@/data/site";
import { CreatePlaythroughDialog } from "@/comps/playthroughs/CreatePlaythroughDialog";
import { Footer } from "@/comps/shell/Footer";
import { Button, ButtonLink } from "@/comps/ui/Button";
import { Card } from "@/comps/ui/Card";
import { SectionLabel } from "@/comps/ui/SectionLabel";
import { useLanding } from "./useLanding";

const text = landingText;

const FEATURE_ICONS: IconType[] = [
	LuLayers,
	LuBriefcase,
	LuStore,
	LuWallet,
	LuListChecks,
	LuDownload,
];

const linkClasses = "flex min-h-11 items-center px-2 hover:underline lg:min-h-9";

type Landing = ReturnType<typeof useLanding>;

function PrimaryAction({ landing }: { landing: Landing }) {
	return landing.returning ? (
		<ButtonLink href={OVERVIEW_HREF} variant="primary">
			{text.cta.dashboard}
		</ButtonLink>
	) : (
		<Button variant="primary" onClick={landing.openCreate}>
			{text.cta.create}
		</Button>
	);
}

function Header({ landing }: { landing: Landing }) {
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
						{shellText.brandWords.map((word) => (
							<span
								key={word}
								className="font-brand text-[13px] leading-[1.05] font-extrabold italic"
							>
								{word}
							</span>
						))}
					</span>
					<span className="sr-only">{APP_NAME}</span>
				</Link>
				<nav
					aria-label={text.header.label}
					className="ms-auto hidden items-center gap-1 md:flex"
				>
					<a href="#features" className={linkClasses}>
						{text.header.features}
					</a>
					<a href="#faq" className={linkClasses}>
						{text.header.faq}
					</a>
					<a
						href={GITHUB_URL}
						target="_blank"
						rel="noopener noreferrer"
						className={linkClasses}
					>
						{text.header.github}
					</a>
					<a
						href={DISCORD_URL}
						target="_blank"
						rel="noopener noreferrer"
						className={linkClasses}
					>
						{text.header.discord}
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
	return (
		<>
			<Image
				src="/landing/overview-light.png"
				alt={text.hero.preview}
				width={1280}
				height={800}
				priority
				className="border-line block w-full rounded-md border-[1.5px] dark:hidden"
			/>
			<Image
				src="/landing/overview-dark.png"
				alt={text.hero.preview}
				width={1280}
				height={800}
				className="border-line hidden w-full rounded-md border-[1.5px] dark:block"
			/>
		</>
	);
}

function Hero({ landing }: { landing: Landing }) {
	const active = landing.returning ? landing.activePlaythrough : null;

	return (
		<section className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 pt-12 pb-8 text-center lg:px-8">
			<h1 className="max-w-3xl text-4xl leading-tight font-semibold lg:text-6xl">
				{text.hero.titleStart}
				<span className="text-primary">{text.hero.titleEnd}</span>
			</h1>
			<p className="text-muted max-w-2xl text-base lg:text-lg">{text.hero.body}</p>
			<div className="flex flex-wrap items-center justify-center gap-3">
				<PrimaryAction landing={landing} />
				{landing.returning ? (
					<Button onClick={landing.openCreate}>{text.cta.newPlaythrough}</Button>
				) : (
					<ButtonLink href="#features" variant="link">
						{text.cta.learn}
					</ButtonLink>
				)}
			</div>
			{active && (
				<Link href={OVERVIEW_HREF} className="block w-full max-w-md">
					<Card className="hover:bg-tint flex flex-col gap-0.5 p-4 text-start">
						<SectionLabel className="text-muted">
							{text.continueCard.label}
						</SectionLabel>
						<span className="text-lg font-semibold">{active.name}</span>
						<span className="text-muted">
							{text.continueCard.level(readStoreLevel(active))} ·{" "}
							{text.continueCard.updated(formatDate(active.lastModified))}
						</span>
					</Card>
				</Link>
			)}
			<OverviewPreview />
		</section>
	);
}

function Steps() {
	return (
		<section className="bg-tint">
			<div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 lg:px-8">
				<h2 className="text-center text-3xl font-semibold">{text.steps.title}</h2>
				<ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{text.steps.items.map((step, index) => (
						<li
							key={step.title}
							className="flex flex-col items-center gap-2 text-center"
						>
							<span
								aria-hidden="true"
								className="bg-primary text-on-primary flex size-10 items-center justify-center rounded-full font-mono font-medium"
							>
								{index + 1}
							</span>
							<h3 className="font-semibold">{step.title}</h3>
							<p className="text-muted max-w-xs">{step.body}</p>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}

function Features() {
	return (
		<section
			id="features"
			className="mx-auto flex max-w-6xl scroll-mt-20 flex-col gap-6 px-4 py-12 lg:px-8"
		>
			<div className="flex flex-col items-center gap-2 text-center">
				<SectionLabel className="text-primary">{text.features.eyebrow}</SectionLabel>
				<h2 className="text-3xl font-semibold">{text.features.title}</h2>
				<p className="text-muted max-w-2xl">{text.features.body}</p>
			</div>
			<ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{text.features.items.map((feature, index) => {
					const Icon = FEATURE_ICONS[index];
					return (
						<li key={feature.title}>
							<Card className="flex h-full items-start gap-3 p-4">
								<span className="bg-tint text-primary flex size-10 shrink-0 items-center justify-center rounded-md">
									<Icon size={20} aria-hidden="true" />
								</span>
								<div className="flex flex-col gap-1">
									<h3 className="font-semibold">{feature.title}</h3>
									<p className="text-muted">{feature.body}</p>
								</div>
							</Card>
						</li>
					);
				})}
			</ul>
		</section>
	);
}

/** One answer is open at a time. */
function Faq() {
	const [open, setOpen] = useState<number | null>(null);
	const baseId = useId();

	return (
		<section id="faq" className="mx-auto flex max-w-3xl scroll-mt-20 flex-col gap-6 px-4 py-12">
			<h2 className="text-center text-3xl font-semibold">{text.faq.title}</h2>
			<ul className="flex flex-col gap-2">
				{text.faq.items.map((item, index) => {
					const isOpen = open === index;
					const Icon = isOpen ? LuMinus : LuPlus;
					return (
						<li key={item.question}>
							<Card className="flex flex-col">
								<h3>
									<button
										type="button"
										aria-expanded={isOpen}
										aria-controls={`${baseId}-${index}`}
										onClick={() => setOpen(isOpen ? null : index)}
										className="flex min-h-13 w-full items-center justify-between gap-3 px-4 py-2 text-start font-semibold"
									>
										{item.question}
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
									{item.answer}
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
	return (
		<section className="bg-tint">
			<div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-12 text-center lg:px-8">
				<h2 className="text-3xl font-semibold">{text.closing.title}</h2>
				<p className="text-muted">{text.closing.body}</p>
				<div className="flex flex-wrap justify-center gap-3">
					<PrimaryAction landing={landing} />
					{landing.returning && (
						<Button onClick={landing.openCreate}>{text.cta.newPlaythrough}</Button>
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
