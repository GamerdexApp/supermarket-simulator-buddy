"use client";

import { useMemo, useState } from "react";
import { LuPlus, LuSearch } from "react-icons/lu";
import type { Playthrough } from "@/types/playthrough";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { useUrlParams } from "@/lib/hooks/useUrlParams";
import { playthroughsText } from "@/lib/messages/playthroughs";
import { filterAndSort, nextActiveAfterDelete } from "@/service/playthroughList";
import type { PlaythroughSort } from "@/service/playthroughList";
import { BACKUP_HREF } from "@/data/nav";
import { PageHeader } from "@/comps/shell/PageHeader";
import { Button, ButtonLink } from "@/comps/ui/Button";
import { Card } from "@/comps/ui/Card";
import { EmptyState } from "@/comps/ui/EmptyState";
import { Field } from "@/comps/ui/Field";
import { Input } from "@/comps/ui/Input";
import { Select } from "@/comps/ui/Select";
import { useToast } from "@/comps/ui/Toast";
import { CreatePlaythroughDialog } from "./CreatePlaythroughDialog";
import { DeletePlaythroughDialog } from "./DeletePlaythroughDialog";
import { EditPlaythroughDialog } from "./EditPlaythroughDialog";
import { PlaythroughCard } from "./PlaythroughCard";

const text = playthroughsText;

const SORTS: PlaythroughSort[] = ["lastModified", "name", "createdAt", "storeLevel"];

export function PlaythroughsPage() {
	const { playthroughs, activePlaythrough, setActivePlaythrough, deletePlaythrough, updateData } =
		usePlaythrough();
	const showToast = useToast();
	const params = useUrlParams();
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState<PlaythroughSort>("lastModified");
	const [editing, setEditing] = useState<Playthrough | null>(null);
	const [deleting, setDeleting] = useState<Playthrough | null>(null);
	const [deletedLast, setDeletedLast] = useState(false);

	const creating = params.get("new") === "1";
	const openCreate = () => params.set({ new: "1" });
	const closeCreate = () => params.set({ new: null });

	const visible = useMemo(
		() => filterAndSort(playthroughs, search, sort),
		[playthroughs, search, sort]
	);

	const setActive = (playthrough: Playthrough) => {
		setActivePlaythrough(playthrough.id);
		showToast({ variant: "success", title: text.card.switched(playthrough.name) });
	};

	const confirmDelete = (playthrough: Playthrough) => {
		const previous = deletePlaythrough(playthrough.id);
		if (!previous) return;
		setDeletedLast(previous.playthroughs.length === 1);
		showToast({
			variant: "success",
			title: text.delete.done(playthrough.name),
			message: text.delete.doneMessage,
			action: {
				label: text.delete.undo,
				onAction: () => {
					updateData(() => previous);
					setDeletedLast(false);
				},
			},
		});
	};

	const deletingIsActive = deleting !== null && deleting.id === activePlaythrough?.id;
	const nextActive = deleting ? nextActiveAfterDelete(playthroughs, deleting.id) : null;

	return (
		<>
			<PageHeader
				title={text.title}
				subline={text.subline(playthroughs.length, activePlaythrough?.name ?? null)}
				actions={
					<Button variant="primary" onClick={openCreate}>
						<LuPlus size={16} aria-hidden="true" />
						{text.newPlaythrough}
					</Button>
				}
			/>
			{playthroughs.length === 0 ? (
				<EmptyState
					title={deletedLast ? text.empty.deletedTitle : text.empty.title}
					description={text.empty.description}
					actions={
						<>
							<Button variant="primary" onClick={openCreate}>
								<LuPlus size={16} aria-hidden="true" />
								{text.newPlaythrough}
							</Button>
							<ButtonLink href={BACKUP_HREF} variant="link">
								{text.empty.restore}
							</ButtonLink>
						</>
					}
				/>
			) : (
				<>
					<Card className="flex flex-col gap-3 p-4">
						<div className="grid gap-3 lg:grid-cols-[1fr_14rem] lg:items-end">
							<Input
								type="search"
								value={search}
								aria-label={text.filters.search}
								placeholder={text.filters.search}
								leadingIcon={<LuSearch size={16} aria-hidden="true" />}
								onChange={(event) => setSearch(event.target.value)}
							/>
							<Field label={text.filters.sortLabel}>
								<Select
									value={sort}
									onChange={(event) =>
										setSort(event.target.value as PlaythroughSort)
									}
								>
									{SORTS.map((id) => (
										<option key={id} value={id}>
											{text.filters.sort[id]}
										</option>
									))}
								</Select>
							</Field>
						</div>
						<div className="text-muted flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
							<span className="font-mono text-xs">
								{text.filters.showing(visible.length, playthroughs.length)}
							</span>
							{search.trim() !== "" && (
								<Button variant="link" onClick={() => setSearch("")}>
									{text.filters.clear}
								</Button>
							)}
						</div>
					</Card>
					{visible.length === 0 ? (
						<EmptyState
							title={text.noMatch.title(search)}
							description={text.noMatch.description}
							actions={
								<Button onClick={() => setSearch("")}>{text.filters.clear}</Button>
							}
						/>
					) : (
						<div className="grid items-start gap-4 lg:grid-cols-2 2xl:grid-cols-3">
							{visible.map((playthrough) => (
								<PlaythroughCard
									key={playthrough.id}
									playthrough={playthrough}
									isActive={playthrough.id === activePlaythrough?.id}
									onSetActive={() => setActive(playthrough)}
									onEdit={() => setEditing(playthrough)}
									onDelete={() => setDeleting(playthrough)}
								/>
							))}
						</div>
					)}
				</>
			)}
			<CreatePlaythroughDialog open={creating} onClose={closeCreate} />
			<EditPlaythroughDialog playthrough={editing} onClose={() => setEditing(null)} />
			<DeletePlaythroughDialog
				playthrough={deleting}
				isActive={deletingIsActive}
				nextActiveName={nextActive?.name ?? null}
				onConfirm={confirmDelete}
				onClose={() => setDeleting(null)}
			/>
		</>
	);
}
