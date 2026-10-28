"use client";

import { useTranslations } from "next-intl";
import { useId } from "react";
import type { Playthrough } from "@/types/playthrough";
import { formatMoney, formatNumber } from "@/lib/format";
import { useListEdit } from "@/lib/hooks/useListEdit";
import { readStoreLevel } from "@/service/appData";
import type { Employee, RoleId, StatRoleId } from "@/service/management";
import { allEmployees, employeeNumber, hasStat, hiringTotals, roles } from "@/service/management";
import { LockReason } from "@/comps/page/LockReason";
import { Badge } from "@/comps/ui/Badge";
import { Button } from "@/comps/ui/Button";
import { Card } from "@/comps/ui/Card";
import { SummaryTile } from "@/comps/ui/SummaryTile";
import { StoreLevelTile } from "./StoreLevelTile";

function Fact({ label, value }: { label: string; value: string }) {
	return (
		<div className="bg-bg flex flex-col rounded-md px-2.5 py-1.5">
			<span className="text-muted text-xs">{label}</span>
			<span className="font-mono font-medium">{value}</span>
		</div>
	);
}

function StatLine({ roleId, stat }: { roleId: StatRoleId; stat: number }) {
	const t = useTranslations("management.hiring.roles");
	return (
		<p className="text-muted">
			{t.rich(`${roleId}.stat`, {
				value: formatNumber(stat),
				stat: (chunks) => <span className="text-ink font-mono font-medium">{chunks}</span>,
			})}
		</p>
	);
}

interface EmployeeCardProps {
	roleId: RoleId;
	employee: Employee;
	playthrough: Playthrough;
	onHire: (name: string) => void;
	onFire: (name: string) => void;
}

function EmployeeCard({ roleId, employee, playthrough, onHire, onFire }: EmployeeCardProps) {
	const t = useTranslations("management");
	const titleId = useId();
	const name = t(`hiring.roles.${roleId}.employeeName`, { number: employeeNumber(employee) });
	const hired = (playthrough.hiredEmployees ?? []).includes(employee.id);
	const level = readStoreLevel(playthrough);
	const reachable = level >= employee.storeLevel;

	return (
		<Card
			role="group"
			aria-labelledby={titleId}
			className={`flex flex-col gap-3 p-4 ${hired ? "bg-tint" : ""} ${!hired && !reachable ? "border-dashed" : ""}`}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="flex flex-col">
					<h3 id={titleId} className="font-semibold">
						{name}
					</h3>
					<span className="text-muted font-mono text-xs">{employee.id}</span>
				</div>
				{hired && <Badge tone="kept">{t("hiring.hiredBadge")}</Badge>}
			</div>
			{hasStat(roleId) && employee.stat !== undefined && (
				<StatLine roleId={roleId} stat={employee.stat} />
			)}
			<div className="grid grid-cols-3 gap-2">
				<Fact label={t("hiring.level")} value={formatNumber(employee.storeLevel)} />
				<Fact label={t("hiring.cost")} value={formatMoney(employee.hiringCost)} />
				<Fact
					label={t("hiring.wage")}
					value={t("hiring.perDay", { amount: formatMoney(employee.dailyWage) })}
				/>
			</div>
			{hired ? (
				<Button variant="danger" onClick={() => onFire(name)}>
					{t("hiring.fire")}
				</Button>
			) : reachable ? (
				<Button variant="primary" onClick={() => onHire(name)}>
					{t("hiring.hire")}
				</Button>
			) : (
				<>
					<LockReason
						reasons={[
							t("requiresLevel", { level: employee.storeLevel, current: level }),
						]}
					/>
					<Button disabled>{t("locked")}</Button>
				</>
			)}
		</Card>
	);
}

export function HiringTab({ playthrough }: { playthrough: Playthrough }) {
	const t = useTranslations("management.hiring");
	const { add, remove } = useListEdit(playthrough.id, "hiredEmployees");
	const totals = hiringTotals(allEmployees, playthrough);

	return (
		<div className="flex flex-col gap-6">
			<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
				<div className="col-span-2 lg:col-span-1">
					<SummaryTile
						label={t("dailyWages")}
						value={formatMoney(totals.dailyWages)}
						caption={t("dailyWagesCaption")}
						emphasis
					/>
				</div>
				<SummaryTile label={t("hired")} value={totals.hired} total={totals.total} />
				<SummaryTile
					label={t("hiringCosts")}
					value={formatMoney(totals.hiringCosts)}
					caption={t("hiringCostsCaption")}
				/>
				<StoreLevelTile playthrough={playthrough} />
			</div>
			{roles.map((role) => {
				const roleTotals = hiringTotals(role.employees, playthrough);
				return (
					<section key={role.id} className="flex flex-col gap-3">
						<div className="flex flex-wrap items-baseline justify-between gap-2">
							<h2 className="text-lg font-semibold">
								{t(`roles.${role.id}.title`)}
								<span className="text-muted ms-2 font-mono text-sm font-normal">
									{t("hiredOf", {
										count: formatNumber(roleTotals.hired),
										total: formatNumber(roleTotals.total),
									})}
								</span>
							</h2>
							{roleTotals.dailyWages > 0 && (
								<span className="font-mono">
									{t("roleWages", { amount: formatMoney(roleTotals.dailyWages) })}
								</span>
							)}
						</div>
						<div className="grid items-start gap-4 md:grid-cols-2 2xl:grid-cols-3">
							{role.employees.map((employee) => (
								<EmployeeCard
									key={employee.id}
									roleId={role.id}
									employee={employee}
									playthrough={playthrough}
									onHire={(name) => add([employee.id], t("hiredToast", { name }))}
									onFire={(name) =>
										remove([employee.id], t("firedToast", { name }))
									}
								/>
							))}
						</div>
					</section>
				);
			})}
		</div>
	);
}
