"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import type { AppData } from "@/types/playthrough";
import { formatNumber, formatShortDate } from "@/lib/format";
import type { ImportMode, ParseStats } from "@/service/backup";
import { applyImport, parseBackup, planImport, summarizeImport } from "@/service/backup";
import { Button } from "@/comps/ui/Button";
import { Dialog } from "@/comps/ui/Dialog";
import { Note } from "@/comps/ui/Note";
import { RadioGroup } from "@/comps/ui/RadioGroup";
import { ScrollRegion } from "@/comps/ui/ScrollRegion";

export interface ImportFile {
	name: string;
	size: number;
	text: string;
}

interface ImportDialogProps {
	file: ImportFile | null;
	current: AppData;
	mode: ImportMode;
	onModeChange: (mode: ImportMode) => void;
	onClose: () => void;
	onConfirm: (next: AppData, summary: string, mode: ImportMode) => void;
}

const IMPORT_MODES = ["merge", "replace"] as const;
const KILOBYTE = 1024;

export function ImportDialog({
	file,
	current,
	mode,
	onModeChange,
	onClose,
	onConfirm,
}: ImportDialogProps) {
	const t = useTranslations("settings.importDialog");
	const locale = useLocale();
	const parsed = useMemo(() => (file ? parseBackup(file.text) : null), [file]);
	const incoming = parsed?.ok ? parsed.data : null;
	const rows = useMemo(
		() => (incoming ? planImport(current, incoming, mode) : []),
		[current, incoming, mode]
	);
	const summary = new Intl.ListFormat(locale, { type: "unit" }).format(
		summarizeImport(rows).map(({ result, count }) =>
			t(`summary.${result}`, { amount: formatNumber(count) })
		)
	);
	const modeOptions = IMPORT_MODES.map((id) => ({ id, label: t(`modes.${id}`) }));

	const formatSize = (bytes: number) =>
		bytes < KILOBYTE
			? t("bytes", { count: formatNumber(bytes) })
			: t("kilobytes", { count: formatNumber(Math.max(1, Math.round(bytes / KILOBYTE))) });
	const formatDate = (iso?: string) => (iso ? formatShortDate(iso) : t("notThere"));

	const checksText = (stats: ParseStats, kept: number) =>
		[
			t("checks", {
				count: stats.read,
				amount: formatNumber(stats.read),
				kept: formatNumber(kept),
			}),
			stats.skipped > 0 &&
				t("skipped", { count: stats.skipped, amount: formatNumber(stats.skipped) }),
			stats.levelsFixed > 0 &&
				t("levelsFixed", {
					count: stats.levelsFixed,
					amount: formatNumber(stats.levelsFixed),
				}),
		]
			.filter(Boolean)
			.join(" ");

	return (
		<Dialog
			open={file !== null}
			onClose={onClose}
			variant="wide"
			title={t("title")}
			description={
				file ? t("fileInfo", { name: file.name, size: formatSize(file.size) }) : undefined
			}
			footer={
				incoming ? (
					<>
						<Button onClick={onClose}>{t("cancel")}</Button>
						<Button
							variant={mode === "replace" ? "danger" : "primary"}
							onClick={() =>
								onConfirm(applyImport(current, incoming, mode), summary, mode)
							}
						>
							{t(mode)}
						</Button>
					</>
				) : (
					<Button onClick={onClose}>{t("close")}</Button>
				)
			}
		>
			{parsed && !parsed.ok && (
				<Note tone="warning" title={t("failedTitle")}>
					{t(`errors.${parsed.error}`)}
				</Note>
			)}
			{parsed?.ok && (
				<>
					<Note title={t("checksTitle")}>
						{checksText(parsed.stats, parsed.data.playthroughs.length)}
					</Note>
					<div className="flex flex-col gap-2">
						<h3 className="font-medium">{t("howToApply")}</h3>
						<RadioGroup
							label={t("modeLabel")}
							options={modeOptions}
							value={mode}
							onChange={onModeChange}
						/>
						<p className="text-muted">{t(`modeNotes.${mode}`)}</p>
					</div>
					<div className="flex flex-col gap-2">
						<h3 className="font-medium">{t("whatChanges")}</h3>
						<ScrollRegion label={t("whatChanges")}>
							<table className="w-full text-start">
								<thead className="text-muted text-xs">
									<tr>
										<th className="py-1 pe-3 font-medium">
											{t("columns.playthrough")}
										</th>
										<th className="py-1 pe-3 font-medium">
											{t("columns.inFile")}
										</th>
										<th className="py-1 pe-3 font-medium">
											{t("columns.onDevice")}
										</th>
										<th className="py-1 font-medium">{t("columns.result")}</th>
									</tr>
								</thead>
								<tbody>
									{rows.map((row, index) => (
										<tr
											key={index}
											className="border-line border-t-[1.5px] align-top"
										>
											<td className="py-2 pe-3 font-medium">{row.name}</td>
											<td className="py-2 pe-3">
												{formatDate(row.fileModified)}
											</td>
											<td className="py-2 pe-3">
												{formatDate(row.deviceModified)}
											</td>
											<td className="py-2">{t(`results.${row.result}`)}</td>
										</tr>
									))}
								</tbody>
							</table>
						</ScrollRegion>
						<p className="text-muted">{summary || t("noPlaythroughs")}</p>
						<p className="text-muted">{t("undoNote")}</p>
					</div>
				</>
			)}
		</Dialog>
	);
}
