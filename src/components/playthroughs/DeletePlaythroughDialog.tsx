"use client";

import { useTranslations } from "next-intl";
import { LuTriangleAlert } from "react-icons/lu";
import type { Playthrough } from "@/types/playthrough";
import { BACKUP_HREF } from "@/data/nav";
import { Button, ButtonLink } from "@/comps/ui/Button";
import { Dialog } from "@/comps/ui/Dialog";

interface DeletePlaythroughDialogProps {
	playthrough: Playthrough | null;
	isActive: boolean;
	nextActiveName: string | null;
	onConfirm: (playthrough: Playthrough) => void;
	onClose: () => void;
}

export function DeletePlaythroughDialog({
	playthrough,
	isActive,
	nextActiveName,
	onConfirm,
	onClose,
}: DeletePlaythroughDialogProps) {
	const t = useTranslations("playthroughs.delete");
	return (
		<Dialog
			open={playthrough !== null}
			onClose={onClose}
			title={t("title")}
			description={t("description")}
			footer={
				<>
					<Button data-autofocus onClick={onClose}>
						{t("cancel")}
					</Button>
					<Button
						variant="danger"
						onClick={() => {
							if (playthrough) onConfirm(playthrough);
							onClose();
						}}
					>
						{t("confirm")}
					</Button>
				</>
			}
		>
			{playthrough && (
				<>
					<div className="bg-bg flex flex-col gap-2 rounded-md p-3">
						<p className="flex items-start gap-2">
							<LuTriangleAlert
								size={18}
								aria-hidden="true"
								className="text-danger mt-0.5 shrink-0"
							/>
							<span>{t("question", { name: playthrough.name })}</span>
						</p>
						{isActive && (
							<p className="text-muted">
								{nextActiveName
									? t("activeNext", { next: nextActiveName })
									: t("activeLast")}
							</p>
						)}
					</div>
					<div>
						<ButtonLink href={BACKUP_HREF} variant="link">
							{t("exportFirst")}
						</ButtonLink>
					</div>
				</>
			)}
		</Dialog>
	);
}
