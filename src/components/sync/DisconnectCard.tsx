"use client";

import { useTranslations } from "next-intl";
import { useSync } from "@/lib/contexts/SyncContext";
import { Button } from "@/comps/ui/Button";

export function DisconnectCard() {
	const t = useTranslations("sync.disconnect");
	const tSync = useTranslations("sync");
	const { provider, signOut } = useSync();
	if (!provider) return null;

	return (
		<div className="border-danger bg-surface flex flex-col gap-3 rounded-md border-[1.5px] p-4">
			<h2 className="text-danger text-base font-semibold">{t("title")}</h2>
			<p>{t("body")}</p>
			<div>
				<Button variant="danger" onClick={signOut}>
					{t("button", { provider: tSync(`provider.${provider}.name`) })}
				</Button>
			</div>
			<p className="text-muted">{t(`${provider}Hint`)}</p>
		</div>
	);
}
