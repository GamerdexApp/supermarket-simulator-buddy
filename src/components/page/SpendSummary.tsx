import type { ReactNode } from "react";
import { formatMoney } from "@/lib/format";
import { Card } from "@/comps/ui/Card";
import { ProgressBar } from "@/comps/ui/ProgressBar";
import { SectionLabel } from "@/comps/ui/SectionLabel";

interface SpendSummaryProps {
	label: string;
	amount: number;
	progressText: string;
	progress: number;
	/** Tiles that sit beside the summary, such as the store level. */
	tiles?: ReactNode;
}

export function SpendSummary({ label, amount, progressText, progress, tiles }: SpendSummaryProps) {
	return (
		<div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
			<Card className="flex flex-col gap-2 p-4">
				<SectionLabel className="text-muted">{label}</SectionLabel>
				<span className="text-primary font-mono text-3xl font-medium">
					{formatMoney(amount)}
				</span>
				<ProgressBar value={progress} label={progressText} />
				<span className="text-muted">{progressText}</span>
			</Card>
			{tiles && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{tiles}</div>}
		</div>
	);
}
