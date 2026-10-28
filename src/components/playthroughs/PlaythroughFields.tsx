"use client";

import { playthroughsText } from "@/lib/messages/playthroughs";
import { Field } from "@/comps/ui/Field";
import { Input } from "@/comps/ui/Input";
import { Textarea } from "@/comps/ui/Textarea";

const text = playthroughsText.fields;

interface PlaythroughFieldsProps {
	name: string;
	description: string;
	showNameError: boolean;
	onNameChange: (name: string) => void;
	onDescriptionChange: (description: string) => void;
}

/** The two fields the old create and edit modals had, with the same labels and rules. */
export function PlaythroughFields({
	name,
	description,
	showNameError,
	onNameChange,
	onDescriptionChange,
}: PlaythroughFieldsProps) {
	return (
		<>
			<Field
				label={`${text.nameLabel} *`}
				error={showNameError && name.trim() === "" ? text.nameError : undefined}
			>
				<Input
					value={name}
					placeholder={text.namePlaceholder}
					onChange={(event) => onNameChange(event.target.value)}
					required
					data-autofocus
				/>
			</Field>
			<Field label={text.descriptionLabel} optional>
				<Textarea
					value={description}
					placeholder={text.descriptionPlaceholder}
					onChange={(event) => onDescriptionChange(event.target.value)}
					rows={3}
				/>
			</Field>
		</>
	);
}
