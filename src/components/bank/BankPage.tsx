"use client";

import { useId, useState } from "react";
import type { Loan } from "@/types";
import type { Playthrough } from "@/types/playthrough";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { formatDate, formatMoney } from "@/lib/format";
import { bankText } from "@/lib/messages/bank";
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

const text = bankText;

const cents = (amount: number) =>
	`$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const percent = (rate: number) => `${(rate * 100).toFixed(1)}%`;

function Row({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex justify-between gap-4">
			<span className="text-muted">{label}</span>
			<span className="font-mono font-medium">{value}</span>
		</div>
	);
}

function useLoanEdit(playthrough: Playthrough) {
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
				label: text.undo,
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
				text.activated(index + 1)
			),
		remove: (index: number) =>
			save((current) => removeLoan(current, playthrough.id, index), text.removed(index + 1)),
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
					{text.loanTitle(index + 1)}
				</h2>
				<Badge
					tone={state === "active" ? "kept" : state === "available" ? "added" : "locked"}
				>
					{text.states[state]}
				</Badge>
			</div>
			<div className="flex flex-col gap-1">
				<Row label={text.principal} value={formatMoney(loan.originalAmount)} />
				<Row label={text.rate} value={percent(loan.dailyInterest)} />
				<Row label={text.level} value={String(loan.storeLevel)} />
			</div>
			<div className="flex flex-col gap-1.5">
				<label htmlFor={sliderId} className="font-medium">
					{text.term(term)}
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
					<span>{text.days(loan.minTermLength)}</span>
					<span>{text.days(loan.maxTermLength)}</span>
				</div>
				{active && <p className="text-muted text-xs">{text.termFixed}</p>}
			</div>
			<div className="bg-bg flex flex-col gap-1 rounded-md p-3">
				<h3 className="font-semibold">{text.details}</h3>
				<Row label={text.totalInterest} value={cents(details.totalInterest)} />
				<Row label={text.totalPayment} value={cents(details.totalPayment)} />
				<Row label={text.dailyPayment} value={cents(details.dailyPayment)} />
			</div>
			{active ? (
				<>
					<p className="text-muted">
						{text.activatedOn(formatDate(active.activatedDate))}
					</p>
					<Button variant="danger" onClick={onRemove}>
						{text.remove}
					</Button>
				</>
			) : reachable ? (
				<Button variant="primary" onClick={() => onActivate(term)}>
					{text.activate}
				</Button>
			) : (
				<>
					<LockReason reasons={[text.requiresLevel(loan.storeLevel, level)]} />
					<Button disabled>{text.locked}</Button>
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
	const copy = text.yourLoans;

	return (
		<div className="flex flex-col gap-3">
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
				<SummaryTile
					label={copy.activeLoans}
					value={totals.active}
					total={bank.loans.length}
				/>
				<SummaryTile label={copy.dailyPayment} value={cents(totals.dailyPayment)} />
				<div className="col-span-2 sm:col-span-1">
					<SummaryTile label={copy.totalDebt} value={cents(totals.totalDebt)} emphasis />
				</div>
			</div>
			<Card className="flex flex-col gap-3 p-4">
				<h2 className="text-lg font-semibold">{copy.title}</h2>
				{entries.length === 0 ? (
					<p className="text-muted">{copy.none}</p>
				) : (
					<ul className="flex flex-col">
						{entries.map(({ entry, loan, details }) => (
							<li
								key={entry.loanIndex}
								className="border-line flex flex-wrap items-center justify-between gap-3 border-t-[1.5px] py-3 first:border-t-0 first:pt-0"
							>
								<span className="flex min-w-0 flex-col">
									<span className="font-semibold">
										{text.loanTitle(entry.loanIndex + 1)}
									</span>
									<span className="text-muted">
										{copy.line(
											formatMoney(loan.originalAmount),
											percent(loan.dailyInterest),
											entry.termLength
										)}
									</span>
									<span className="text-muted">
										{text.activatedOn(formatDate(entry.activatedDate))} ·{" "}
										{copy.payments(
											cents(details.dailyPayment),
											cents(details.totalPayment)
										)}
									</span>
								</span>
								<Button variant="danger" onClick={() => onRemove(entry.loanIndex)}>
									{text.remove}
								</Button>
							</li>
						))}
					</ul>
				)}
				<p className="text-muted text-xs">{copy.formula}</p>
			</Card>
		</div>
	);
}

function BankContent({ playthrough }: { playthrough: Playthrough }) {
	const { activate, remove } = useLoanEdit(playthrough);

	return (
		<>
			<PageHeader title={text.title} subline={text.subline(playthrough.name)} />
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
	return (
		<PlaythroughGate title={text.title} emptyDescription={text.emptyDescription}>
			{(playthrough) => <BankContent playthrough={playthrough} />}
		</PlaythroughGate>
	);
}
