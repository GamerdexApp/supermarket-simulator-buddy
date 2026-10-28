"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useSync } from "@/lib/contexts/SyncContext";
import {
	CREATE_REPOSITORY_URL,
	DATA_REPOSITORY_NAME,
	type DataRepository,
	findDataRepository,
} from "@/lib/sync/repository";
import { SettingsCard } from "@/comps/settings/SettingsCard";
import { Button, ButtonLink } from "@/comps/ui/Button";
import { Note } from "@/comps/ui/Note";

type Lookup =
	| { state: "loading" }
	| { state: "failed" }
	| { state: "done"; repository: Exclude<DataRepository, { kind: "ready" }> };

export function RepositoryPicker() {
	const t = useTranslations("sync.repository");
	const { listRepositories, chooseRepository, installApp } = useSync();
	const [lookup, setLookup] = useState<Lookup>({ state: "loading" });
	const name = DATA_REPOSITORY_NAME;

	const look = () =>
		listRepositories().then(
			(repositories) => {
				const repository = findDataRepository(repositories);
				if (repository.kind === "ready") chooseRepository(repository.fullName);
				else setLookup({ state: "done", repository });
			},
			() => setLookup({ state: "failed" })
		);

	const checkAgain = () => {
		setLookup({ state: "loading" });
		void look();
	};

	// The lookup runs once, when the picker opens.
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => void look(), []);

	const checkAgainButton = (
		<Button variant="secondary" onClick={checkAgain}>
			{t("recheckButton")}
		</Button>
	);

	return (
		<SettingsCard title={t("title")} description={t("body", { name })}>
			{lookup.state === "loading" && <p className="text-muted">{t("checking", { name })}</p>}
			{lookup.state === "failed" && (
				<>
					<Note tone="warning">{t("checkFailed")}</Note>
					<div>{checkAgainButton}</div>
				</>
			)}
			{lookup.state === "done" && lookup.repository.kind === "public" && (
				<>
					<Note tone="warning">
						{t("public", { fullName: lookup.repository.fullName })}
					</Note>
					<div>{checkAgainButton}</div>
				</>
			)}
			{lookup.state === "done" && lookup.repository.kind === "missing" && (
				<>
					<p className="font-semibold">{t("missing", { name })}</p>
					<ol className="list-decimal space-y-4 ps-5 marker:font-semibold">
						<li className="list-item">
							<span className="block">{t("steps.create", { name })}</span>
							<span className="mt-2 block">
								<ButtonLink
									href={CREATE_REPOSITORY_URL}
									target="_blank"
									rel="noreferrer"
								>
									{t("createButton")}
								</ButtonLink>
							</span>
						</li>
						<li className="list-item">
							<span className="block">{t("steps.install", { name })}</span>
							<span className="mt-2 block">
								<Button onClick={installApp}>{t("installButton")}</Button>
							</span>
						</li>
						<li className="list-item">
							<span className="block">{t("steps.recheck")}</span>
							<span className="mt-2 block">{checkAgainButton}</span>
						</li>
					</ol>
				</>
			)}
		</SettingsCard>
	);
}
