"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import type { Loan } from "@/types";
import type { Playthrough } from "@/types/playthrough";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { formatCents, formatDate, formatMoney, formatNumber, formatPercent } from "@/lib/format";
import { readStoreLevel, updatePlaythrough } from "@/service/appData";
import {
	activateLoan,
	activeLoanEntries,
	loanDetails,
	loanTotals,
	removeLoan,
} from "@/service/bank";
import { bank } from "@/data/supermarket-simulator/bank";
import { LockReason } from "@/comps/page/LockReason";
import { PageHeader } from "@/comps/shell/PageHeader";
import { PlaythroughGate } from "@/comps/shell/PlaythroughGate";
import { Badge } from "@/comps/ui/Badge";
import { Button } from "@/comps/ui/Button";
import { Card } from "@/comps/ui/Card";
import { SummaryTile } from "@/comps/ui/SummaryTile";
import { useToast } from "@/comps/ui/Toast";

const loanNumber = (index: number) => ({ number: formatNumber(index + 1) });

const dayCount = (days: number) => ({ count: days, amount: formatNumber(days) });

function Row({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex justify-between gap-4">
			<span className="text-muted">{label}</span>
			<span className="font-mono font-medium">{value}</span>
		</div>
	);
}

function useLoanEdit(playthrough: Playthrough) {
	const t = useTranslations("bank");
	const { updateData } = usePlaythrough();
	const showToast = useToast();

	/** Undo puts back only the loans list, so other edits made since then stay. */
	const save = (change: Parameters<typeof updateData>[0], title: string) => {
		const previous = updateData(change);
		if (!previous) return;
		const previousLoans = previous.playthroughs.find(
			(p) => p.id === playthrough.id
		)?.activeLoans;
		showToast({
			variant: "success",
			title,
			action: {
				label: t("undo"),
				onAction: () =>
					updateData((current) =>
						updatePlaythrough(current, playthrough.id, { activeLoans: previousLoans })
					),
			},
		});
	};

	return {
		activate: (index: number, term: number) =>
			save(
				(current) => activateLoan(current, playthrough.id, index, term),
				t("activated", loanNumber(index))
			),
		remove: (index: number) =>
			save(
				(current) => removeLoan(current, playthrough.id, index),
				t("removed", loanNumber(index))
			),
	};
}

interface LoanCardProps {
	loan: Loan;
	index: number;
	playthrough: Playthrough;
	onActivate: (term: number) => void;
	onRemove: () => void;
}

function LoanCard({ loan, index, playthrough, onActivate, onRemove }: LoanCardProps) {
	const t = useTranslations("bank");
	const sliderId = useId();
	const titleId = useId();
	const active = (playthrough.activeLoans ?? []).find((entry) => entry.loanIndex === index);
	const [draftTerm, setDraftTerm] = useState(loan.minTermLength);
	const term = active?.termLength ?? draftTerm;
	const level = readStoreLevel(playthrough);
	const reachable = level >= loan.storeLevel;
	const state = active ? "active" : reachable ? "available" : "locked";
	const details = loanDetails(loan, term);

	return (
		<Card
			role="group"
			aria-labelledby={titleId}
			className={`flex flex-col gap-4 p-4 ${active ? "bg-tint" : ""} ${state === "locked" ? "border-dashed" : ""}`}
		>
			<div className="flex items-start justify-between gap-3">
				<h2 id={titleId} className="text-xl font-semibold">
					{t("loanTitle", loanNumber(index))}
				</h2>
				<Badge
					tone={state === "active" ? "kept" : state === "available" ? "added" : "locked"}
				>
					{t(`states.${state}`)}
				</Badge>
			</div>
			<div className="flex flex-col gap-1">
				<Row label={t("principal")} value={formatMoney(loan.originalAmount)} />
				<Row label={t("rate")} value={formatPercent(loan.dailyInterest)} />
				<Row label={t("level")} value={formatNumber(loan.storeLevel)} />
			</div>
			<div className="flex flex-col gap-1.5">
				<label htmlFor={sliderId} className="font-medium">
					{t("term", dayCount(term))}
				</label>
				<input
					id={sliderId}
					type="range"
					min={loan.minTermLength}
					max={loan.maxTermLength}
					value={term}
					disabled={Boolean(active) || !reachable}
					onChange={(event) => setDraftTerm(Number(event.target.value))}
					className="accent-primary h-11 w-full disabled:opacity-50 lg:h-6"
				/>
				<div className="text-muted flex justify-between text-xs">
					<span>{t("days", dayCount(loan.minTermLength))}</span>
					<span>{t("days", dayCount(loan.maxTermLength))}</span>
				</div>
				{active && <p className="text-muted text-xs">{t("termFixed")}</p>}
			</div>
			<div className="bg-bg flex flex-col gap-1 rounded-md p-3">
				<h3 className="font-semibold">{t("details")}</h3>
				<Row label={t("totalInterest")} value={formatCents(details.totalInterest)} />
				<Row label={t("totalPayment")} value={formatCents(details.totalPayment)} />
				<Row label={t("dailyPayment")} value={formatCents(details.dailyPayment)} />
			</div>
			{active ? (
				<>
					<p className="text-muted">
						{t("activatedOn", { date: formatDate(active.activatedDate) })}
					</p>
					<Button variant="danger" onClick={onRemove}>
						{t("remove")}
					</Button>
				</>
			) : reachable ? (
				<Button variant="primary" onClick={() => onActivate(term)}>
					{t("activate")}
				</Button>
			) : (
				<>
					<LockReason
						reasons={[
							t("requiresLevel", {
								level: formatNumber(loan.storeLevel),
								current: formatNumber(level),
							}),
						]}
					/>
					<Button disabled>{t("locked")}</Button>
				</>
			)}
		</Card>
	);
}

function YourLoans({
	playthrough,
	onRemove,
}: {
	playthrough: Playthrough;
	onRemove: (index: number) => void;
}) {
	const entries = activeLoanEntries(playthrough);
	const totals = loanTotals(playthrough);
	const t = useTranslations("bank");

	return (
		<div className="flex flex-col gap-3">
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
				<SummaryTile
					label={t("yourLoans.activeLoans")}
					value={totals.active}
					total={bank.loans.length}
				/>
				<SummaryTile
					label={t("yourLoans.dailyPayment")}
					value={formatCents(totals.dailyPayment)}
				/>
				<div className="col-span-2 sm:col-span-1">
					<SummaryTile
						label={t("yourLoans.totalDebt")}
						value={formatCents(totals.totalDebt)}
						emphasis
					/>
				</div>
			</div>
			<Card className="flex flex-col gap-3 p-4">
				<h2 className="text-lg font-semibold">{t("yourLoans.title")}</h2>
				{entries.length === 0 ? (
					<p className="text-muted">{t("yourLoans.none")}</p>
				) : (
					<ul className="flex flex-col">
						{entries.map(({ entry, loan, details }) => (
							<li
								key={entry.loanIndex}
								className="border-line flex flex-wrap items-center justify-between gap-3 border-t-[1.5px] py-3 first:border-t-0 first:pt-0"
							>
								<span className="flex min-w-0 flex-col">
									<span className="font-semibold">
										{t("loanTitle", loanNumber(entry.loanIndex))}
									</span>
									<span className="text-muted">
										{t("yourLoans.line", {
											principal: formatMoney(loan.originalAmount),
											rate: formatPercent(loan.dailyInterest),
											...dayCount(entry.termLength),
										})}
									</span>
									<span className="text-muted">
										{t("activatedOn", {
											date: formatDate(entry.activatedDate),
										})}{" "}
										·{" "}
										{t("yourLoans.payments", {
											daily: formatCents(details.dailyPayment),
											total: formatCents(details.totalPayment),
										})}
									</span>
								</span>
								<Button variant="danger" onClick={() => onRemove(entry.loanIndex)}>
									{t("remove")}
								</Button>
							</li>
						))}
					</ul>
				)}
				<p className="text-muted text-xs">{t("yourLoans.formula")}</p>
			</Card>
		</div>
	);
}

function BankContent({ playthrough }: { playthrough: Playthrough }) {
	const t = useTranslations("bank");
	const { activate, remove } = useLoanEdit(playthrough);

	return (
		<>
			<PageHeader title={t("title")} subline={t("subline", { name: playthrough.name })} />
			<YourLoans playthrough={playthrough} onRemove={remove} />
			<div className="grid items-start gap-4 lg:grid-cols-2">
				{bank.loans.map((loan, index) => (
					<LoanCard
						key={index}
						loan={loan}
						index={index}
						playthrough={playthrough}
						onActivate={(term) => activate(index, term)}
						onRemove={() => remove(index)}
					/>
				))}
			</div>
		</>
	);
}

export function BankPage() {
	const t = useTranslations("bank");
	return (
		<PlaythroughGate title={t("title")} emptyDescription={t("emptyDescription")}>
			{(playthrough) => <BankContent playthrough={playthrough} />}
		</PlaythroughGate>
	);
}
