"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { type CallbackOutcome, useSync } from "@/lib/contexts/SyncContext";
import { SYNC_HREF } from "@/data/nav";
import { PageHeader } from "@/comps/shell/PageHeader";
import { ButtonLink } from "@/comps/ui/Button";
import { Note } from "@/comps/ui/Note";

export default function SyncCallbackPage() {
	const t = useTranslations("sync.callback");
	const router = useRouter();
	const { completeSignIn } = useSync();
	const started = useRef(false);
	const [problem, setProblem] = useState<Exclude<CallbackOutcome, "ok"> | null>(null);

	useEffect(() => {
		if (started.current) return;
		started.current = true;
		completeSignIn(window.location.search).then((outcome) => {
			if (outcome === "ok") router.replace(SYNC_HREF);
			else setProblem(outcome);
		});
	}, [completeSignIn, router]);

	return (
		<>
			<PageHeader title={t("title")} />
			{problem ? (
				<div className="flex flex-col gap-3">
					<Note tone="warning">{t(problem)}</Note>
					<div>
						<ButtonLink href={SYNC_HREF}>{t("back")}</ButtonLink>
					</div>
				</div>
			) : (
				<p className="text-muted">{t("working")}</p>
			)}
		</>
	);
}
