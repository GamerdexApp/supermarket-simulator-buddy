"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { playthroughsText } from "@/lib/messages/playthroughs";
import { Button } from "@/comps/ui/Button";
import { Dialog } from "@/comps/ui/Dialog";
import { useToast } from "@/comps/ui/Toast";
import { PlaythroughFields } from "./PlaythroughFields";

const text = playthroughsText.create;

/** Mounted only while open, so every open starts empty. */
function CreateDialogContent({ onClose }: { onClose: () => void }) {
	const formId = useId();
	const { addPlaythrough } = usePlaythrough();
	const showToast = useToast();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [showError, setShowError] = useState(false);

	const trimmedName = name.trim();

	const submit = (event: FormEvent) => {
		event.preventDefault();
		if (trimmedName === "") {
			setShowError(true);
			return;
		}
		const id = addPlaythrough({
			name: trimmedName,
			description: description.trim() || undefined,
		});
		if (!id) return;
		showToast({ variant: "success", title: text.done(trimmedName) });
		onClose();
	};

	return (
		<Dialog
			open
			onClose={onClose}
			title={text.title}
			footer={
				<>
					<Button onClick={onClose}>{playthroughsText.fields.cancel}</Button>
					<Button
						type="submit"
						form={formId}
						variant="primary"
						aria-disabled={trimmedName === ""}
					>
						{text.submit}
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
				<div className="bg-bg flex flex-col gap-1.5 rounded-md p-3">
					<span className="font-semibold">{text.starterTitle}</span>
					<ul className="text-muted list-disc ps-5">
						{text.starter.map((line) => (
							<li key={line}>{line}</li>
						))}
					</ul>
				</div>
			</form>
		</Dialog>
	);
}

export function CreatePlaythroughDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
	return open ? <CreateDialogContent onClose={onClose} /> : null;
}
