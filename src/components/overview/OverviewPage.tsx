"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import type { Playthrough } from "@/types/playthrough";
import { formatCents, formatDate, formatMoney, formatNumber } from "@/lib/format";
import { readStoreLevel } from "@/service/appData";
import { overviewFigures } from "@/service/overview";
import { PLAYTHROUGHS_HREF } from "@/data/nav";
import { PageHeader } from "@/comps/shell/PageHeader";
import { PlaythroughGate } from "@/comps/shell/PlaythroughGate";
import { ButtonLink } from "@/comps/ui/Button";
import { Card } from "@/comps/ui/Card";
import { ProgressBar } from "@/comps/ui/ProgressBar";

interface Progress {
	owned: number;
	total: number;
}

const share = ({ owned, total }: Progress) => owned / total;

const progressCounts = ({ owned, total }: Progress) => ({
	owned: formatNumber(owned),
	total: formatNumber(total),
});

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
	const t = useTranslations("overview");
	const hasActiveLoans = loans.active > 0;
	const financialRows = [
		{ id: "activeLoans", value: formatNumber(loans.active), warn: false },
		{ id: "dailyPayments", value: formatCents(loans.dailyPayment), warn: hasActiveLoans },
		{ id: "totalDebt", value: formatCents(loans.totalDebt), warn: false },
	] as const;

	return (
		<>
			<PageHeader title={t("title")} subline={t("subline", { name: playthrough.name })} />
			<Card className="flex flex-wrap items-start justify-between gap-3 p-4">
				<div className="flex min-w-0 flex-col gap-1">
					<h2 className="text-xl font-semibold">{playthrough.name}</h2>
					{playthrough.description && (
						<p className="text-muted">{playthrough.description}</p>
					)}
					<p className="text-muted text-xs">
						{t("identity.created", { date: formatDate(playthrough.createdAt) })} ·{" "}
						{t("identity.lastModified", { date: formatDate(playthrough.lastModified) })}
					</p>
				</div>
				<ButtonLink href={PLAYTHROUGHS_HREF}>{t("identity.manage")}</ButtonLink>
			</Card>
			<div className="grid items-stretch gap-4 lg:grid-cols-3">
				<OverviewCard title={t("storeLevel.title")} subtitle={t("storeLevel.subtitle")}>
					<span className="text-primary font-mono text-4xl font-medium">
						{formatNumber(readStoreLevel(playthrough))}
					</span>
					<p className="text-muted text-xs">{t("storeLevel.hint")}</p>
				</OverviewCard>
				<OverviewCard
					title={t("financial.title")}
					action={<ButtonLink href="/bank">{t("financial.view")}</ButtonLink>}
				>
					<dl className="flex flex-col">
						{financialRows.map(({ id, value, warn }) => (
							<div
								key={id}
								className="border-line flex items-baseline justify-between gap-3 border-t-[1.5px] py-2 first:border-t-0 first:pt-0"
							>
								<dt className="text-muted">{t(`financial.${id}`)}</dt>
								<dd
									className={`font-mono text-lg font-medium ${warn ? "text-warn" : ""}`}
								>
									{value}
								</dd>
							</div>
						))}
					</dl>
					<p className="text-muted text-xs">
						{hasActiveLoans ? t("financial.formula") : t("financial.none")}
					</p>
				</OverviewCard>
				<OverviewCard title={t("investment.title")} subtitle={t("investment.subtitle")}>
					<span className="text-primary font-mono text-4xl font-medium">
						{formatMoney(spent.total)}
					</span>
					<p className="text-muted text-xs">
						{t("investment.formula", {
							managementSpent: formatMoney(spent.management),
							marketSpent: formatMoney(spent.market),
							total: formatMoney(spent.total),
						})}
					</p>
				</OverviewCard>
			</div>
			<div className="grid items-stretch gap-4 lg:grid-cols-2">
				<OverviewCard
					title={t("management.title")}
					action={<ButtonLink href="/management">{t("management.view")}</ButtonLink>}
				>
					<ul className="flex flex-col">
						<FigureRow
							label={t("management.licenses")}
							detail={t("management.unlocked", progressCounts(figures.licenses))}
							badge={formatMoney(spent.licenses)}
							progress={share(figures.licenses)}
						/>
						<FigureRow
							label={t("management.growth")}
							detail={t("management.unlocked", progressCounts(figures.growth))}
							badge={formatMoney(spent.growth)}
							progress={share(figures.growth)}
						/>
						<FigureRow
							label={t("management.storage")}
							detail={t("management.unlocked", progressCounts(figures.storage))}
							badge={formatMoney(spent.storage)}
							progress={share(figures.storage)}
						/>
						<FigureRow
							label={t("management.employees")}
							detail={t("management.hired", progressCounts(figures.employees))}
							badge={t("management.perDay", {
								amount: formatMoney(figures.dailyWages),
							})}
							progress={share(figures.employees)}
						/>
					</ul>
					<p className="text-muted text-xs">
						{t("management.hiringNote", { amount: formatMoney(figures.hiringCosts) })}
					</p>
					<TotalLine label={t("management.total")} amount={spent.management} />
				</OverviewCard>
				<OverviewCard
					title={t("market.title")}
					action={<ButtonLink href="/market">{t("market.view")}</ButtonLink>}
				>
					<ul className="flex flex-col">
						<FigureRow
							label={t("market.products")}
							detail={t("market.licensesUnlocked", {
								count: figures.licenses.owned,
								amount: formatNumber(figures.licenses.owned),
							})}
							badge={t("market.available", {
								amount: formatNumber(figures.productsAvailable),
							})}
						/>
						<FigureRow
							label={t("market.tools")}
							detail={t("market.unlocked", progressCounts(figures.tools))}
							badge={formatMoney(spent.tools)}
						/>
						<FigureRow
							label={t("market.vehicles")}
							detail={t("market.unlocked", progressCounts(figures.vehicles))}
							badge={formatMoney(spent.vehicles)}
						/>
						<FigureRow
							label={t("market.furniture")}
							detail={t("market.furnitureItems", {
								count: figures.furniture,
								amount: formatNumber(figures.furniture),
							})}
						/>
					</ul>
					<p className="text-muted text-xs">{t("market.note")}</p>
					<TotalLine label={t("market.total")} amount={spent.market} />
				</OverviewCard>
			</div>
		</>
	);
}

export function OverviewPage() {
	const t = useTranslations("overview");
	return (
		<PlaythroughGate title={t("title")} emptyDescription={t("emptyDescription")}>
			{(playthrough) => <OverviewContent playthrough={playthrough} />}
		</PlaythroughGate>
	);
}
