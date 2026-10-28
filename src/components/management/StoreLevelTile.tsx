import type { Playthrough } from "@/types/playthrough";
import { managementText } from "@/lib/messages/management";
import { readStoreLevel } from "@/service/appData";
import { SummaryTile } from "@/comps/ui/SummaryTile";

/** Shows the level that gates every unlock, so the reasons on the cards can be checked here. */
export function StoreLevelTile({ playthrough }: { playthrough: Playthrough }) {
	return (
		<SummaryTile
			label={managementText.storeLevel}
			value={readStoreLevel(playthrough)}
			caption={managementText.storeLevelCaption}
		/>
	);
}
