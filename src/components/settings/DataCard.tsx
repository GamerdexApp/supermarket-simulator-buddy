"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { LuDownload, LuUpload } from "react-icons/lu";
import type { AppData } from "@/types/playthrough";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { useOptionalSync } from "@/lib/contexts/SyncContext";
import { formatNumber } from "@/lib/format";
import type { ImportMode } from "@/service/backup";
import { backupFileName, downloadBackup } from "@/service/backup";
import { EMPTY_APP_DATA } from "@/service/storage";
import { Badge } from "@/comps/ui/Badge";
import { Button } from "@/comps/ui/Button";
import { Checkbox } from "@/comps/ui/Checkbox";
import { Note } from "@/comps/ui/Note";
import { useToast } from "@/comps/ui/Toast";
import { ImportDialog } from "./ImportDialog";
import type { ImportFile } from "./ImportDialog";
import { SettingsCard } from "./SettingsCard";

const sectionClasses = "border-line flex flex-col gap-2 border-t-[1.5px] pt-3";

export function DataCard() {
	const t = useTranslations("settings");
	const tSync = useTranslations("sync");
	const locale = useLocale();
	const showToast = useToast();
	const { appData, playthroughs, updateData } = usePlaythrough();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [chosenFile, setChosenFile] = useState<File | null>(null);
	const [reviewedFile, setReviewedFile] = useState<ImportFile | null>(null);
	const [importMode, setImportMode] = useState<ImportMode>("merge");
	const [confirmingReset, setConfirmingReset] = useState(false);
	const [alsoDeleteSyncedCopy, setAlsoDeleteSyncedCopy] = useState(false);
	const sync = useOptionalSync();
	const syncProvider = sync?.status === "signedOut" ? null : (sync?.provider ?? null);

	const exportBackup = () => {
		showToast({
			variant: "success",
			title: t("data.export.done"),
			message: downloadBackup(appData),
		});
	};

	const chooseFile = (event: ChangeEvent<HTMLInputElement>) => {
		setChosenFile(event.target.files?.[0] ?? null);
	};

	const reviewImport = async () => {
		if (!chosenFile) return;
		setImportMode("merge");
		setReviewedFile({
			name: chosenFile.name,
			size: chosenFile.size,
			text: await chosenFile.text(),
		});
	};

	const confirmImport = (next: AppData, summary: string, mode: ImportMode) => {
		const previous = updateData(() => next);
		if (!previous) return;
		setReviewedFile(null);
		setChosenFile(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
		showToast({
			variant: "success",
			title: mode === "merge" ? t("data.import.merged") : t("data.import.replaced"),
			message: summary,
			action: { label: t("data.import.undo"), onAction: () => updateData(() => previous) },
		});
	};

	/**
	 * With sync on, keeping the synced copy disconnects this browser, so the next sync cannot bring
	 * the playthroughs back. Deleting it keeps sync on, so the empty data reaches the other devices.
	 */
	const confirmReset = () => {
		const disconnect = syncProvider !== null && !alsoDeleteSyncedCopy;
		const previous = updateData(() => EMPTY_APP_DATA);
		if (!previous) return;
		if (disconnect) sync?.signOut();
		setConfirmingReset(false);
		setAlsoDeleteSyncedCopy(false);
		showToast({
			variant: "warning",
			title: t("data.reset.done"),
			message: t(
				disconnect ? "data.reset.doneMessageDisconnected" : "data.reset.doneMessage",
				{
					count: previous.playthroughs.length,
					amount: formatNumber(previous.playthroughs.length),
				}
			),
			action: { label: t("data.reset.undo"), onAction: () => updateData(() => previous) },
		});
	};

	const names = new Intl.ListFormat(locale, { type: "conjunction" }).format(
		playthroughs.map((playthrough) => playthrough.name)
	);

	return (
		<SettingsCard
			title={t("data.title")}
			aside={
				<Badge tone="added">
					{t("playthroughCount", {
						count: playthroughs.length,
						amount: formatNumber(playthroughs.length),
					})}
				</Badge>
			}
		>
			<section className={sectionClasses}>
				<h3 className="font-medium">{t("data.export.title")}</h3>
				<p className="text-muted">{t("data.export.description")}</p>
				<div>
					<Button onClick={exportBackup}>
						<LuDownload size={16} aria-hidden="true" />
						{t("data.export.button")}
					</Button>
				</div>
				<code className="text-muted font-mono text-xs break-all">{backupFileName()}</code>
			</section>
			<section className={sectionClasses}>
				<h3 className="font-medium">{t("data.import.title")}</h3>
				<input
					ref={fileInputRef}
					type="file"
					accept=".json,application/json"
					aria-label={t("data.import.fileLabel")}
					onChange={chooseFile}
					className="sr-only"
					tabIndex={-1}
				/>
				<div className="flex flex-wrap items-center gap-3">
					<Button onClick={() => fileInputRef.current?.click()}>
						<LuUpload size={16} aria-hidden="true" />
						{t("data.import.chooseFile")}
					</Button>
					<span className="text-muted break-all">
						{chosenFile?.name ?? t("data.import.noFile")}
					</span>
				</div>
				<p className="text-muted">{t("data.import.description")}</p>
				<div>
					<Button variant="primary" disabled={!chosenFile} onClick={reviewImport}>
						{t("data.import.review")}
					</Button>
				</div>
			</section>
			<section className={sectionClasses}>
				<h3 className="font-medium">{t("data.reset.title")}</h3>
				<p className="text-muted">{t("data.reset.warning")}</p>
				{confirmingReset ? (
					<Note tone="warning" title={t("data.reset.confirmTitle")}>
						<span className="flex flex-col gap-3">
							<span>{t("data.reset.confirmBody", { names })}</span>
							{syncProvider && (
								<span className="flex flex-col gap-1">
									<Checkbox
										label={t("data.reset.syncedCopy", {
											provider: tSync(`provider.${syncProvider}.name`),
										})}
										checked={alsoDeleteSyncedCopy}
										onChange={setAlsoDeleteSyncedCopy}
									/>
									{alsoDeleteSyncedCopy && (
										<span className="text-muted">
											{t("data.reset.syncedOn")}
										</span>
									)}
								</span>
							)}
							<span className="flex flex-wrap gap-2">
								<Button data-autofocus onClick={() => setConfirmingReset(false)}>
									{t("data.reset.cancel")}
								</Button>
								<Button variant="danger" onClick={confirmReset}>
									{t("data.reset.confirm")}
								</Button>
							</span>
						</span>
					</Note>
				) : (
					<div>
						<Button
							variant="danger"
							disabled={playthroughs.length === 0}
							onClick={() => setConfirmingReset(true)}
						>
							{t("data.reset.button")}
						</Button>
					</div>
				)}
			</section>
			<ImportDialog
				file={reviewedFile}
				current={appData}
				mode={importMode}
				onModeChange={setImportMode}
				onClose={() => setReviewedFile(null)}
				onConfirm={confirmImport}
			/>
		</SettingsCard>
	);
}
