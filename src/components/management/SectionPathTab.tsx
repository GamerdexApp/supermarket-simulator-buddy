"use client";

import { useState } from "react";
import { LuCheck } from "react-icons/lu";
import type { Playthrough } from "@/types/playthrough";
import { formatMoney } from "@/lib/format";
import { useListEdit } from "@/lib/hooks/useListEdit";
import { managementText } from "@/lib/messages/management";
import { readStoreLevel } from "@/service/appData";
import type { SectionKind, SectionStep } from "@/service/management";
import {
	countKnown,
	nextSection,
	priceOfSections,
	sectionField,
	sectionPath,
	sectionsOf,
	sectionsToLock,
} from "@/service/management";
import { spending } from "@/service/spending";
import { LockReason } from "@/comps/page/LockReason";
import { SpendSummary } from "@/comps/page/SpendSummary";
import { Badge } from "@/comps/ui/Badge";
import { Button } from "@/comps/ui/Button";
import { Note } from "@/comps/ui/Note";
import { SummaryTile } from "@/comps/ui/SummaryTile";
import { StoreLevelTile } from "./StoreLevelTile";

const text = managementText;
const sectionText = text.sections;

const priceText = (price: number) => (price === 0 ? text.free : formatMoney(price));

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

function Chip({ children }: { children: string }) {
	return (
		<span className="border-line bg-bg rounded-full border-[1.5px] px-2 py-0.5 font-mono text-xs">
			{children}
		</span>
	);
}

interface StepRowProps {
	kind: SectionKind;
	step: SectionStep;
	position: number;
	isLast: boolean;
	playthrough: Playthrough;
	confirming: boolean;
	onUnlock: () => void;
	onUndo: () => void;
	onConfirmCascade: (nums: string[]) => void;
	onCancelCascade: () => void;
}

function StepRow({
	kind,
	step,
	position,
	isLast,
	playthrough,
	confirming,
	onUnlock,
	onUndo,
	onConfirmCascade,
	onCancelCascade,
}: StepRowProps) {
	const { section, unlocked, isNext, needsSection, needsLevel } = step;
	const kindText = sectionText[kind];
	const reasons = [
		needsSection && sectionText.unlockFirst(needsSection),
		needsLevel !== null && text.requiresLevel(needsLevel, readStoreLevel(playthrough)),
	].filter((reason): reason is string => Boolean(reason));
	const cascade = confirming ? sectionsToLock(kind, playthrough, section.sectionNum) : [];

	return (
		<li className="flex gap-3">
			<div className="flex flex-col items-center">
				<span
					aria-hidden="true"
					className={`flex size-9 shrink-0 items-center justify-center rounded-full border-[1.5px] font-mono text-sm font-medium ${
						unlocked
							? "border-primary bg-primary text-on-primary"
							: isNext
								? "border-primary text-primary border-[3px]"
								: "border-line text-muted border-dashed"
					}`}
				>
					{unlocked ? <LuCheck size={16} /> : position}
				</span>
				{!isLast && (
					<span
						aria-hidden="true"
						className={`w-0.5 flex-1 ${unlocked ? "bg-primary" : "bg-line"}`}
					/>
				)}
			</div>
			<div
				className={`mb-3 flex min-w-0 flex-1 flex-col gap-2 rounded-md border-[1.5px] p-3 ${
					unlocked
						? "border-line bg-tint"
						: isNext
							? "border-primary bg-surface border-[3px]"
							: "border-line bg-surface border-dashed"
				}`}
			>
				<div className="flex flex-wrap items-center justify-between gap-2">
					<span className="font-semibold">{kindText.title(section.sectionNum)}</span>
					{unlocked && <Badge tone="kept">{text.states.unlocked}</Badge>}
					{isNext && <Badge tone="added">{sectionText.nextToUnlock}</Badge>}
				</div>
				<div className="flex flex-wrap gap-1.5">
					<Chip>{sectionText.level(section.storeLevel)}</Chip>
					<Chip>{priceText(section.price)}</Chip>
					<Chip>{sectionText.size(section.size)}</Chip>
				</div>
				{!unlocked && !isNext && reasons.length > 0 && <LockReason reasons={reasons} />}
				{isNext && (
					<div>
						<Button variant="primary" onClick={onUnlock}>
							{sectionText.unlock}
						</Button>
					</div>
				)}
				{unlocked && !confirming && (
					<div>
						<Button variant="danger" onClick={onUndo}>
							{sectionText.undo}
						</Button>
					</div>
				)}
				{confirming && (
					<Note
						tone="warning"
						title={sectionText.cascade.title(kindText.name, section.sectionNum)}
					>
						<span className="flex flex-col gap-3">
							<span>
								{sectionText.cascade.body(
									cascade,
									formatMoney(priceOfSections(kind, cascade))
								)}
							</span>
							<span className="flex flex-wrap gap-2">
								<Button data-autofocus onClick={onCancelCascade}>
									{sectionText.cascade.keep}
								</Button>
								<Button variant="danger" onClick={() => onConfirmCascade(cascade)}>
									{sectionText.cascade.confirm(cascade)}
								</Button>
							</span>
						</span>
					</Note>
				)}
			</div>
		</li>
	);
}

export function SectionPathTab({
	kind,
	playthrough,
}: {
	kind: SectionKind;
	playthrough: Playthrough;
}) {
	const [confirmingNum, setConfirmingNum] = useState<string | null>(null);
	const { add, remove } = useListEdit(playthrough.id, sectionField(kind));
	const kindText = sectionText[kind];
	const kindLabel = capitalize(kindText.name);

	const steps = sectionPath(kind, playthrough);
	const sections = sectionsOf(kind);
	const unlocked = countKnown(
		playthrough[sectionField(kind)],
		sections.map((section) => section.sectionNum)
	);
	const next = nextSection(kind, playthrough);

	const undo = (sectionNum: string) => {
		const nums = sectionsToLock(kind, playthrough, sectionNum);
		if (nums.length === 1) remove(nums, sectionText.undone(kindLabel, nums));
		else setConfirmingNum(sectionNum);
	};

	return (
		<div className="flex flex-col gap-4">
			<SpendSummary
				label={kindText.totalSpent}
				amount={spending(playthrough)[kind]}
				progress={unlocked / sections.length}
				progressText={kindText.unlockedOf(unlocked, sections.length)}
				tiles={
					<>
						<div className="col-span-2">
							<SummaryTile
								label={sectionText.nextSection}
								value={next ? next.section.sectionNum : sectionText.allUnlocked}
								caption={
									next
										? sectionText.nextSectionValue(
												next.section.sectionNum,
												next.section.storeLevel,
												priceText(next.section.price)
											)
										: undefined
								}
							/>
						</div>
						<StoreLevelTile playthrough={playthrough} />
					</>
				}
			/>
			{kind === "storage" && <Note>{sectionText.storage.firstSectionNote}</Note>}
			<ol aria-label={kindText.pathLabel} className="flex flex-col">
				{steps.map((step, index) => (
					<StepRow
						key={step.section.sectionNum}
						kind={kind}
						step={step}
						position={index + 1}
						isLast={index === steps.length - 1}
						playthrough={playthrough}
						confirming={confirmingNum === step.section.sectionNum}
						onUnlock={() =>
							add(
								[step.section.sectionNum],
								sectionText.unlocked(kindLabel, step.section.sectionNum)
							)
						}
						onUndo={() => undo(step.section.sectionNum)}
						onConfirmCascade={(nums) => {
							setConfirmingNum(null);
							remove(nums, sectionText.undone(kindLabel, nums));
						}}
						onCancelCascade={() => setConfirmingNum(null)}
					/>
				))}
			</ol>
		</div>
	);
}
