"use client";

import { useTranslations } from "next-intl";
import { Field } from "@/comps/ui/Field";
import { Input } from "@/comps/ui/Input";
import { Textarea } from "@/comps/ui/Textarea";

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
	const t = useTranslations("playthroughs.fields");
	return (
		<>
			<Field
				label={`${t("nameLabel")} *`}
				error={showNameError && name.trim() === "" ? t("nameError") : undefined}
			>
				<Input
					value={name}
					placeholder={t("namePlaceholder")}
					onChange={(event) => onNameChange(event.target.value)}
					required
					data-autofocus
				/>
			</Field>
			<Field label={t("descriptionLabel")} optional>
				<Textarea
					value={description}
					placeholder={t("descriptionPlaceholder")}
					onChange={(event) => onDescriptionChange(event.target.value)}
					rows={3}
				/>
			</Field>
		</>
	);
}
