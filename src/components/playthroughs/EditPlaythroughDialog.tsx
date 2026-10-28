"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import type { Playthrough } from "@/types/playthrough";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { formatDate } from "@/lib/format";
import { playthroughsText } from "@/lib/messages/playthroughs";
import { updatePlaythrough } from "@/service/appData";
import { Button } from "@/comps/ui/Button";
import { Dialog } from "@/comps/ui/Dialog";
import { useToast } from "@/comps/ui/Toast";
import { PlaythroughFields } from "./PlaythroughFields";

const text = playthroughsText.edit;

interface EditDialogContentProps {
	playthrough: Playthrough;
	onClose: () => void;
}

/** Mounted only while open, so every open starts from the saved values. */
function EditDialogContent({ playthrough, onClose }: EditDialogContentProps) {
	const formId = useId();
	const { updateData } = usePlaythrough();
	const showToast = useToast();
	const [name, setName] = useState(playthrough.name);
	const [description, setDescription] = useState(playthrough.description ?? "");
	const [showError, setShowError] = useState(false);

	const trimmedName = name.trim();

	const submit = (event: FormEvent) => {
		event.preventDefault();
		if (trimmedName === "") {
			setShowError(true);
			return;
		}
		const previous = updateData((current) =>
			updatePlaythrough(current, playthrough.id, {
				name: trimmedName,
				description: description.trim() || undefined,
			})
		);
		if (!previous) return;
		showToast({
			variant: "success",
			title: text.saved,
			message: text.savedMessage(trimmedName),
		});
		onClose();
	};

	return (
		<Dialog
			open
			onClose={onClose}
			title={text.title}
			description={text.description}
			footer={
				<>
					<Button onClick={onClose}>{playthroughsText.fields.cancel}</Button>
					<Button
						type="submit"
						form={formId}
						variant="primary"
						aria-disabled={trimmedName === ""}
					>
						{text.save}
					</Button>
				</>
			}
		>
			<form id={formId} onSubmit={submit} noValidate className="flex flex-col gap-4">
				<PlaythroughFields
					name={name}
					description={description}
					showNameError={showError}
					onNameChange={setName}
					onDescriptionChange={setDescription}
				/>
				<p className="text-muted text-xs">
					{text.dates(
						formatDate(playthrough.createdAt),
						formatDate(playthrough.lastModified)
					)}
				</p>
			</form>
		</Dialog>
	);
}

interface EditPlaythroughDialogProps {
	playthrough: Playthrough | null;
	onClose: () => void;
}

export function EditPlaythroughDialog({ playthrough, onClose }: EditPlaythroughDialogProps) {
	return playthrough ? <EditDialogContent playthrough={playthrough} onClose={onClose} /> : null;
}
