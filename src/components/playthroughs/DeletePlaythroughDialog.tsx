"use client";

import { LuTriangleAlert } from "react-icons/lu";
import type { Playthrough } from "@/types/playthrough";
import { playthroughsText } from "@/lib/messages/playthroughs";
import { BACKUP_HREF } from "@/data/nav";
import { Button, ButtonLink } from "@/comps/ui/Button";
import { Dialog } from "@/comps/ui/Dialog";

const text = playthroughsText.delete;

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
	return (
		<Dialog
			open={playthrough !== null}
			onClose={onClose}
			title={text.title}
			description={text.description}
			footer={
				<>
					<Button data-autofocus onClick={onClose}>
						{text.cancel}
					</Button>
					<Button
						variant="danger"
						onClick={() => {
							if (playthrough) onConfirm(playthrough);
							onClose();
						}}
					>
						{text.confirm}
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
							<span>{text.question(playthrough.name)}</span>
						</p>
						{isActive && (
							<p className="text-muted">
								{nextActiveName ? text.activeNext(nextActiveName) : text.activeLast}
							</p>
						)}
					</div>
					<div>
						<ButtonLink href={BACKUP_HREF} variant="link">
							{text.exportFirst}
						</ButtonLink>
					</div>
				</>
			)}
		</Dialog>
	);
}
