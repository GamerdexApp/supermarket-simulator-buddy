"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import type { FormEvent } from "react";
import type { Playthrough } from "@/types/playthrough";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { formatDate } from "@/lib/format";
import { updatePlaythrough } from "@/service/appData";
import { Button } from "@/comps/ui/Button";
import { Dialog } from "@/comps/ui/Dialog";
import { useToast } from "@/comps/ui/Toast";
import { PlaythroughFields } from "./PlaythroughFields";

interface EditDialogContentProps {
	playthrough: Playthrough;
	onClose: () => void;
}

/** Mounted only while open, so every open starts from the saved values. */
function EditDialogContent({ playthrough, onClose }: EditDialogContentProps) {
	const t = useTranslations("playthroughs");
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
			title: t("edit.saved"),
			message: t("edit.savedMessage", { name: trimmedName }),
		});
		onClose();
	};

	return (
		<Dialog
			open
			onClose={onClose}
			title={t("edit.title")}
			description={t("edit.description")}
			footer={
				<>
					<Button onClick={onClose}>{t("fields.cancel")}</Button>
					<Button
						type="submit"
						form={formId}
						variant="primary"
						aria-disabled={trimmedName === ""}
					>
						{t("edit.save")}
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
					{t("edit.dates", {
						created: formatDate(playthrough.createdAt),
						updated: formatDate(playthrough.lastModified),
					})}
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
