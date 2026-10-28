"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { LuCheck } from "react-icons/lu";
import type { Playthrough } from "@/types/playthrough";
import { formatMoney, formatNumber } from "@/lib/format";
import { useListEdit } from "@/lib/hooks/useListEdit";
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

/** Section numbers as "5" or "5 to 10", for the sentences that name a run of sections. */
function useSectionRange() {
	const t = useTranslations("management.sections");
	return (nums: string[]) =>
		nums.length === 1 ? nums[0] : t("range", { first: nums[0], last: nums[nums.length - 1] });
}

function usePriceText() {
	const t = useTranslations("management");
	return (price: number) => (price === 0 ? t("free") : formatMoney(price));
}

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
	const t = useTranslations("management");
	const tUi = useTranslations("ui");
	const rangeText = useSectionRange();
	const priceText = usePriceText();
	const { section, unlocked, isNext, needsSection, needsLevel } = step;
	const reasons = [
		needsSection && t("sections.unlockFirst", { num: needsSection }),
		needsLevel !== null &&
			t("requiresLevel", { level: needsLevel, current: readStoreLevel(playthrough) }),
	].filter((reason): reason is string => Boolean(reason));
	const cascade = confirming ? sectionsToLock(kind, playthrough, section.sectionNum) : [];
	const cascadeFollowers = cascade.slice(1);

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
					<span className="font-semibold">
						{t(`sections.${kind}.title`, { num: section.sectionNum })}
					</span>
					{unlocked && <Badge tone="kept">{t("states.unlocked")}</Badge>}
					{isNext && <Badge tone="added">{t("sections.nextToUnlock")}</Badge>}
				</div>
				<div className="flex flex-wrap gap-1.5">
					<Chip>{t("sections.level", { level: section.storeLevel })}</Chip>
					<Chip>{priceText(section.price)}</Chip>
					<Chip>{t("sections.size", { size: section.size })}</Chip>
				</div>
				{!unlocked && !isNext && reasons.length > 0 && <LockReason reasons={reasons} />}
				{isNext && (
					<div>
						<Button variant="primary" onClick={onUnlock}>
							{t("sections.unlock")}
						</Button>
					</div>
				)}
				{unlocked && !confirming && (
					<div>
						<Button variant="danger" onClick={onUndo}>
							{tUi("undo")}
						</Button>
					</div>
				)}
				{confirming && (
					<Note
						tone="warning"
						title={t(`sections.${kind}.cascadeTitle`, { num: section.sectionNum })}
					>
						<span className="flex flex-col gap-3">
							<span>
								{t("sections.cascade.body", {
									count: cascadeFollowers.length,
									range: rangeText(cascadeFollowers),
									price: formatMoney(priceOfSections(kind, cascade)),
								})}
							</span>
							<span className="flex flex-wrap gap-2">
								<Button data-autofocus onClick={onCancelCascade}>
									{t("sections.cascade.keep")}
								</Button>
								<Button variant="danger" onClick={() => onConfirmCascade(cascade)}>
									{t("sections.cascade.confirm", {
										count: cascade.length,
										range: rangeText(cascade),
									})}
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
	const t = useTranslations("management.sections");
	const rangeText = useSectionRange();
	const priceText = usePriceText();
	const [confirmingNum, setConfirmingNum] = useState<string | null>(null);
	const { add, remove } = useListEdit(playthrough.id, sectionField(kind));
	const undoneText = (nums: string[]) =>
		t(`${kind}.undone`, { count: nums.length, range: rangeText(nums) });

	const steps = sectionPath(kind, playthrough);
	const sections = sectionsOf(kind);
	const unlocked = countKnown(
		playthrough[sectionField(kind)],
		sections.map((section) => section.sectionNum)
	);
	const next = nextSection(kind, playthrough);

	const undo = (sectionNum: string) => {
		const nums = sectionsToLock(kind, playthrough, sectionNum);
		if (nums.length === 1) remove(nums, undoneText(nums));
		else setConfirmingNum(sectionNum);
	};

	return (
		<div className="flex flex-col gap-4">
			<SpendSummary
				label={t(`${kind}.totalSpent`)}
				amount={spending(playthrough)[kind]}
				progress={unlocked / sections.length}
				progressText={t(`${kind}.unlockedOf`, {
					owned: formatNumber(unlocked),
					count: sections.length,
					amount: formatNumber(sections.length),
				})}
				tiles={
					<>
						<div className="col-span-2">
							<SummaryTile
								label={t("nextSection")}
								value={next ? next.section.sectionNum : t("allUnlocked")}
								caption={
									next
										? t("nextSectionValue", {
												num: next.section.sectionNum,
												level: next.section.storeLevel,
												price: priceText(next.section.price),
											})
										: undefined
								}
							/>
						</div>
						<StoreLevelTile playthrough={playthrough} />
					</>
				}
			/>
			{kind === "storage" && <Note>{t("storage.firstSectionNote")}</Note>}
			<ol aria-label={t(`${kind}.pathLabel`)} className="flex flex-col">
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
								t(`${kind}.unlocked`, { num: step.section.sectionNum })
							)
						}
						onUndo={() => undo(step.section.sectionNum)}
						onConfirmCascade={(nums) => {
							setConfirmingNum(null);
							remove(nums, undoneText(nums));
						}}
						onCancelCascade={() => setConfirmingNum(null)}
					/>
				))}
			</ol>
		</div>
	);
}
