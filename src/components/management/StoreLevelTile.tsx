import { useTranslations } from "next-intl";
import type { Playthrough } from "@/types/playthrough";
import { readStoreLevel } from "@/service/appData";
import { SummaryTile } from "@/comps/ui/SummaryTile";

/** Shows the level that gates every unlock, so the reasons on the cards can be checked here. */
export function StoreLevelTile({ playthrough }: { playthrough: Playthrough }) {
	const t = useTranslations("management");
	return (
		<SummaryTile
			label={t("storeLevel")}
			value={readStoreLevel(playthrough)}
			caption={t("storeLevelCaption")}
		/>
	);
}
