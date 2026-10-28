"use client";

import type { ReactNode } from "react";
import type { Playthrough } from "@/types/playthrough";
import { formatDate, formatMoney } from "@/lib/format";
import { overviewText } from "@/lib/messages/overview";
import { readStoreLevel } from "@/service/appData";
import { overviewFigures } from "@/service/overview";
import { PLAYTHROUGHS_HREF } from "@/data/nav";
import { PageHeader } from "@/comps/shell/PageHeader";
import { PlaythroughGate } from "@/comps/shell/PlaythroughGate";
import { ButtonLink } from "@/comps/ui/Button";
import { Card } from "@/comps/ui/Card";
import { ProgressBar } from "@/comps/ui/ProgressBar";

const text = overviewText;

const cents = (amount: number) =>
	`$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function OverviewCard({
	title,
	subtitle,
	children,
	action,
}: {
	title: string;
	subtitle?: string;
	children: ReactNode;
	action?: ReactNode;
}) {
	return (
		<Card className="flex flex-col gap-3 p-4">
			<div className="flex flex-col">
				<h2 className="text-lg font-semibold">{title}</h2>
				{subtitle && <p className="text-muted">{subtitle}</p>}
			</div>
			{children}
			{action && <div className="mt-auto pt-1">{action}</div>}
		</Card>
	);
}

function FigureRow({
	label,
	detail,
	badge,
	progress,
}: {
	label: string;
	detail: string;
	badge?: string;
	progress?: number;
}) {
	return (
		<li className="border-line flex flex-col gap-1.5 border-t-[1.5px] py-2.5 first:border-t-0 first:pt-0">
			<div className="flex items-start justify-between gap-3">
				<span className="flex flex-col">
					<span className="font-medium">{label}</span>
					<span className="text-muted text-xs">{detail}</span>
				</span>
				{badge && <span className="font-mono font-medium">{badge}</span>}
			</div>
			{progress !== undefined && (
				<ProgressBar value={progress} label={`${label}: ${detail}`} />
			)}
		</li>
	);
}

function TotalLine({ label, amount }: { label: string; amount: number }) {
	return (
		<div className="border-line flex justify-between gap-3 border-t-[1.5px] pt-2.5">
			<span className="font-semibold">{label}</span>
			<span className="text-primary font-mono font-medium">{formatMoney(amount)}</span>
		</div>
	);
}

function OverviewContent({ playthrough }: { playthrough: Playthrough }) {
	const figures = overviewFigures(playthrough);
	const { spent, loans } = figures;
	const share = ({ owned, total }: { owned: number; total: number }) => owned / total;

	return (
		<>
			<PageHeader title={text.title} subline={text.subline(playthrough.name)} />
			<Card className="flex flex-wrap items-start justify-between gap-3 p-4">
				<div className="flex min-w-0 flex-col gap-1">
					<h2 className="text-xl font-semibold">{playthrough.name}</h2>
					{playthrough.description && (
						<p className="text-muted">{playthrough.description}</p>
					)}
					<p className="text-muted text-xs">
						{text.identity.created(formatDate(playthrough.createdAt))} ·{" "}
						{text.identity.lastModified(formatDate(playthrough.lastModified))}
					</p>
				</div>
				<ButtonLink href={PLAYTHROUGHS_HREF}>{text.identity.manage}</ButtonLink>
			</Card>
			<div className="grid items-stretch gap-4 lg:grid-cols-3">
				<OverviewCard title={text.storeLevel.title} subtitle={text.storeLevel.subtitle}>
					<span className="text-primary font-mono text-4xl font-medium">
						{readStoreLevel(playthrough)}
					</span>
					<p className="text-muted text-xs">{text.storeLevel.hint}</p>
				</OverviewCard>
				<OverviewCard
					title={text.financial.title}
					action={<ButtonLink href="/bank">{text.financial.view}</ButtonLink>}
				>
					<dl className="flex flex-col">
						{[
							[text.financial.activeLoans, String(loans.active)],
							[text.financial.dailyPayments, cents(loans.dailyPayment)],
							[text.financial.totalDebt, cents(loans.totalDebt)],
						].map(([label, value]) => (
							<div
								key={label}
								className="border-line flex items-baseline justify-between gap-3 border-t-[1.5px] py-2 first:border-t-0 first:pt-0"
							>
								<dt className="text-muted">{label}</dt>
								<dd
									className={`font-mono text-lg font-medium ${label === text.financial.dailyPayments && loans.active > 0 ? "text-warn" : ""}`}
								>
									{value}
								</dd>
							</div>
						))}
					</dl>
					<p className="text-muted text-xs">
						{loans.active === 0 ? text.financial.none : text.financial.formula}
					</p>
				</OverviewCard>
				<OverviewCard title={text.investment.title} subtitle={text.investment.subtitle}>
					<span className="text-primary font-mono text-4xl font-medium">
						{formatMoney(spent.total)}
					</span>
					<p className="text-muted text-xs">
						{text.investment.formula(
							formatMoney(spent.management),
							formatMoney(spent.market),
							formatMoney(spent.total)
						)}
					</p>
				</OverviewCard>
			</div>
			<div className="grid items-stretch gap-4 lg:grid-cols-2">
				<OverviewCard
					title={text.management.title}
					action={<ButtonLink href="/management">{text.management.view}</ButtonLink>}
				>
					<ul className="flex flex-col">
						<FigureRow
							label={text.management.licenses}
							detail={text.management.unlocked(
								figures.licenses.owned,
								figures.licenses.total
							)}
							badge={formatMoney(spent.licenses)}
							progress={share(figures.licenses)}
						/>
						<FigureRow
							label={text.management.growth}
							detail={text.management.unlocked(
								figures.growth.owned,
								figures.growth.total
							)}
							badge={formatMoney(spent.growth)}
							progress={share(figures.growth)}
						/>
						<FigureRow
							label={text.management.storage}
							detail={text.management.unlocked(
								figures.storage.owned,
								figures.storage.total
							)}
							badge={formatMoney(spent.storage)}
							progress={share(figures.storage)}
						/>
						<FigureRow
							label={text.management.employees}
							detail={text.management.hired(
								figures.employees.owned,
								figures.employees.total
							)}
							badge={text.management.perDay(formatMoney(figures.dailyWages))}
							progress={share(figures.employees)}
						/>
					</ul>
					<p className="text-muted text-xs">
						{text.management.hiringNote(formatMoney(figures.hiringCosts))}
					</p>
					<TotalLine label={text.management.total} amount={spent.management} />
				</OverviewCard>
				<OverviewCard
					title={text.market.title}
					action={<ButtonLink href="/market">{text.market.view}</ButtonLink>}
				>
					<ul className="flex flex-col">
						<FigureRow
							label={text.market.products}
							detail={text.market.licensesUnlocked(figures.licenses.owned)}
							badge={text.market.available(figures.productsAvailable)}
						/>
						<FigureRow
							label={text.market.tools}
							detail={text.market.unlocked(figures.tools.owned, figures.tools.total)}
							badge={formatMoney(spent.tools)}
						/>
						<FigureRow
							label={text.market.vehicles}
							detail={text.market.unlocked(
								figures.vehicles.owned,
								figures.vehicles.total
							)}
							badge={formatMoney(spent.vehicles)}
						/>
						<FigureRow
							label={text.market.furniture}
							detail={text.market.furnitureItems(figures.furniture)}
						/>
					</ul>
					<p className="text-muted text-xs">{text.market.note}</p>
					<TotalLine label={text.market.total} amount={spent.market} />
				</OverviewCard>
			</div>
		</>
	);
}

export function OverviewPage() {
	return (
		<PlaythroughGate title={text.title} emptyDescription={text.emptyDescription}>
			{(playthrough) => <OverviewContent playthrough={playthrough} />}
		</PlaythroughGate>
	);
}
