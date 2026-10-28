"use client";

import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { settingsText } from "@/lib/messages/settings";
import { PLAYTHROUGHS_HREF } from "@/data/nav";
import { Badge } from "@/comps/ui/Badge";
import { ButtonLink } from "@/comps/ui/Button";
import { Note } from "@/comps/ui/Note";
import { DataCard } from "./DataCard";
import { SettingsCard } from "./SettingsCard";

const text = settingsText;

export function DataTab() {
	const { playthroughs } = usePlaythrough();

	return (
		<div className="grid items-start gap-4 lg:grid-cols-2">
			<div className="flex flex-col gap-4">
				<Note title={text.storageNote.title}>{text.storageNote.body}</Note>
				<DataCard />
			</div>
			<SettingsCard
				title={text.playthroughs.title}
				description={text.playthroughs.description}
				aside={<Badge tone="added">{text.playthroughCount(playthroughs.length)}</Badge>}
			>
				<div>
					<ButtonLink href={PLAYTHROUGHS_HREF}>{text.playthroughs.manage}</ButtonLink>
				</div>
			</SettingsCard>
		</div>
	);
}
