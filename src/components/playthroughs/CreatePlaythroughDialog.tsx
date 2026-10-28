"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import type { FormEvent } from "react";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { Button } from "@/comps/ui/Button";
import { Dialog } from "@/comps/ui/Dialog";
import { useToast } from "@/comps/ui/Toast";
import { PlaythroughFields } from "./PlaythroughFields";

const STARTER_ITEMS = ["item1", "item2", "item3", "item4"] as const;

/** Mounted only while open, so every open starts empty. */
interface CreateDialogProps {
	onClose: () => void;
	/** Runs after the new playthrough is saved and active. */
	onCreated?: () => void;
}

function CreateDialogContent({ onClose, onCreated }: CreateDialogProps) {
	const t = useTranslations("playthroughs");
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
		showToast({ variant: "success", title: t("create.done", { name: trimmedName }) });
		onClose();
		onCreated?.();
	};

	return (
		<Dialog
			open
			onClose={onClose}
			title={t("create.title")}
			footer={
				<>
					<Button onClick={onClose}>{t("fields.cancel")}</Button>
					<Button
						type="submit"
						form={formId}
						variant="primary"
						aria-disabled={trimmedName === ""}
					>
						{t("create.submit")}
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
					<span className="font-semibold">{t("create.starterTitle")}</span>
					<ul className="text-muted list-disc ps-5">
						{STARTER_ITEMS.map((item) => (
							<li key={item}>{t(`create.starter.${item}`)}</li>
						))}
					</ul>
				</div>
			</form>
		</Dialog>
	);
}

export function CreatePlaythroughDialog({ open, ...props }: CreateDialogProps & { open: boolean }) {
	return open ? <CreateDialogContent {...props} /> : null;
}
