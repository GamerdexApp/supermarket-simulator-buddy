"use client";

import { ROOT_FOLDER } from "@gamerdexapp/gamerdex-sync";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { type SyncErrorKind, useSync } from "@/lib/contexts/SyncContext";
import { formatDateTime, formatNumber } from "@/lib/format";
import { type SyncProviderId, usesRepository } from "@/lib/sync/providers";
import { ActivityCard } from "@/comps/sync/ActivityCard";
import { ConflictsCard } from "@/comps/sync/ConflictsCard";
import { ConnectPanel } from "@/comps/sync/ConnectPanel";
import { DeviceCard } from "@/comps/sync/DeviceCard";
import { DisconnectCard } from "@/comps/sync/DisconnectCard";
import { FirstSyncDialog } from "@/comps/sync/FirstSyncDialog";
import { HowSyncWorks } from "@/comps/sync/HowSyncWorks";
import { LivesCard } from "@/comps/sync/LivesCard";
import { PlaythroughsList } from "@/comps/sync/PlaythroughsList";
import { ProviderIcon } from "@/comps/sync/ProviderIcon";
import { ProviderTiles } from "@/comps/sync/ProviderTiles";
import { RepositoryPicker } from "@/comps/sync/RepositoryPicker";
import { SyncSettingsCard } from "@/comps/sync/SyncSettingsCard";
import { Badge } from "@/comps/ui/Badge";
import { Button } from "@/comps/ui/Button";
import { Card } from "@/comps/ui/Card";
import { Note } from "@/comps/ui/Note";
import { SettingsCard } from "./SettingsCard";

function Layout({ main, side }: { main: React.ReactNode; side: React.ReactNode }) {
	return (
		<div className="grid items-start gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
			<div className="flex min-w-0 flex-col gap-4">{main}</div>
			<div className="flex min-w-0 flex-col gap-4">{side}</div>
		</div>
	);
}

function NotConnectedPill() {
	const t = useTranslations("sync.connect");
	return (
		<span className="border-line bg-surface text-muted inline-flex h-8 items-center gap-2 rounded-full border-[1.5px] px-3 text-xs">
			<span aria-hidden="true" className="bg-muted size-1.5 rounded-full" />
			{t("pill")}
		</span>
	);
}

function SignedOutView() {
	const t = useTranslations("sync.connect");
	const sync = useSync();
	const [selected, setSelected] = useState<SyncProviderId>(
		sync.providers.includes("google") ? "google" : "github"
	);

	return (
		<Layout
			main={
				<Card className="flex flex-col gap-4 p-4">
					<div className="flex items-center justify-between gap-3">
						<h2 className="text-lg font-semibold">{t("title")}</h2>
						<NotConnectedPill />
					</div>
					<p className="text-muted">{t("intro")}</p>
					<ProviderTiles
						providers={sync.providers}
						selected={selected}
						onSelect={setSelected}
					/>
					<ConnectPanel
						provider={selected}
						pickAnother={sync.providers.length > 1}
						onConnect={() => sync.signIn(selected)}
					/>
				</Card>
			}
			side={<HowSyncWorks />}
		/>
	);
}

function NeedsRepositoryView() {
	const t = useTranslations("sync.connected");
	const sync = useSync();

	return (
		<Layout
			main={
				<>
					<RepositoryPicker />
					<div>
						<Button variant="ghost" onClick={sync.signOut}>
							{t("signOut")}
						</Button>
					</div>
				</>
			}
			side={<HowSyncWorks />}
		/>
	);
}

interface FailureNoteProps {
	kind: SyncErrorKind | "reauth";
	httpStatus: number | null;
	providerName: string;
	inRepository: boolean;
}

function FailureNote({ kind, httpStatus, providerName, inRepository }: FailureNoteProps) {
	const t = useTranslations("sync.error");
	const messages: Record<SyncErrorKind | "reauth", string> = {
		rateLimit: t("rateLimit"),
		notFound: inRepository ? t("notFound") : t("notFoundFolder", { provider: providerName }),
		forbidden: inRepository ? t("forbidden") : t("forbiddenFolder", { provider: providerName }),
		server: t("server"),
		data: t("data"),
		busy: t("busy"),
		other: t("other"),
		reauth: t("reauth"),
	};
	const status = httpStatus === null ? null : String(httpStatus);

	return (
		<Note tone="warning">
			{messages[kind]}
			{status !== null && (
				<span className="block">
					{inRepository
						? t("httpStatus", { status })
						: t("httpStatusFolder", { provider: providerName, status })}
				</span>
			)}
		</Note>
	);
}

function ConnectedView() {
	const t = useTranslations("sync");
	const sync = useSync();
	const [dismissedFor, setDismissedFor] = useState<object | null>(null);
	const provider = sync.provider ?? "github";
	const providerName = t(`provider.${provider}.name`);
	const inRepository = usesRepository(provider);

	const failure = sync.status === "reauth" ? "reauth" : sync.errorKind;
	const conflictCount = sync.conflicts.length;
	const choiceOpen = sync.pendingChoice !== null && dismissedFor !== sync.pendingChoice;
	const review = () =>
		document.getElementById("sync-conflicts")?.scrollIntoView({ block: "start" });

	return (
		<>
			<Layout
				main={
					<>
						<Card className="flex flex-col gap-4 p-4">
							<div className="flex items-start justify-between gap-3">
								<div className="flex min-w-0 items-center gap-3">
									<ProviderIcon provider={provider} size={22} />
									<div className="flex min-w-0 flex-col">
										<h2 className="text-lg font-semibold">{providerName}</h2>
										<span className="text-muted font-mono text-xs break-all">
											{inRepository
												? sync.repository
												: t("connected.folder", { name: ROOT_FOLDER })}
										</span>
									</div>
								</div>
								<Badge
									tone={
										conflictCount > 0
											? "warn"
											: sync.status === "idle"
												? "kept"
												: "changed"
									}
								>
									{conflictCount > 0
										? t("status.conflicts")
										: t(`status.${sync.status}`)}
								</Badge>
							</div>
							{failure && (
								<FailureNote
									kind={failure}
									httpStatus={sync.errorStatus}
									providerName={providerName}
									inRepository={inRepository}
								/>
							)}
							{conflictCount > 0 && (
								<div className="border-primary bg-tint flex flex-col gap-2 rounded-md border-[1.5px] p-3">
									<p className="font-semibold">
										{t("banner.title", {
											count: conflictCount,
											amount: formatNumber(conflictCount),
										})}
									</p>
									<p className="text-muted">{t("banner.body")}</p>
									<div>
										<Button variant="secondary" onClick={review}>
											{t("banner.review")}
										</Button>
									</div>
								</div>
							)}
							{sync.pendingChoice && !choiceOpen && (
								<div className="border-primary bg-tint flex flex-col gap-2 rounded-md border-[1.5px] p-3">
									<p className="font-semibold">{t("banner.waiting")}</p>
									<div>
										<Button
											variant="secondary"
											onClick={() => setDismissedFor(null)}
										>
											{t("banner.choose")}
										</Button>
									</div>
								</div>
							)}
							<div className="flex flex-wrap items-center justify-between gap-3">
								<span className="text-muted">
									{t("connected.lastSync")}{" "}
									<span className="text-ink">
										{sync.lastSyncAt
											? formatDateTime(sync.lastSyncAt)
											: t("connected.never")}
									</span>
								</span>
								{sync.status === "reauth" ? (
									<Button variant="primary" onClick={() => sync.signIn(provider)}>
										{t("connected.signInWith", { provider: providerName })}
									</Button>
								) : (
									<Button
										variant="primary"
										disabled={
											sync.status === "syncing" ||
											sync.status === "needsChoice"
										}
										onClick={() => void sync.syncNow()}
									>
										{t("connected.syncNow")}
									</Button>
								)}
							</div>
							<PlaythroughsList onReview={review} />
						</Card>
						{conflictCount > 0 && (
							<div id="sync-conflicts" className="scroll-mt-4">
								<ConflictsCard />
							</div>
						)}
						<ActivityCard />
					</>
				}
				side={
					<>
						<SyncSettingsCard />
						<LivesCard />
						<DeviceCard />
						<DisconnectCard />
					</>
				}
			/>
			{sync.pendingChoice && (
				<FirstSyncDialog
					open={choiceOpen}
					choice={sync.pendingChoice}
					onLater={() => setDismissedFor(sync.pendingChoice)}
				/>
			)}
		</>
	);
}

export function SyncTab() {
	const t = useTranslations("sync");
	const sync = useSync();

	if (!sync.available) {
		return (
			<SettingsCard title={t("tab.title")}>
				<Note>{t("unavailable")}</Note>
			</SettingsCard>
		);
	}
	if (sync.status === "signedOut") return <SignedOutView />;
	if (sync.status === "needsRepository") return <NeedsRepositoryView />;
	return <ConnectedView />;
}
