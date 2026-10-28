"use client";

import { useId } from "react";
import type { Playthrough } from "@/types/playthrough";
import { formatMoney } from "@/lib/format";
import { useListEdit } from "@/lib/hooks/useListEdit";
import { managementText } from "@/lib/messages/management";
import { readStoreLevel } from "@/service/appData";
import type { Employee, RoleId } from "@/service/management";
import { allEmployees, employeeNumber, hiringTotals, roles } from "@/service/management";
import { LockReason } from "@/comps/page/LockReason";
import { Badge } from "@/comps/ui/Badge";
import { Button } from "@/comps/ui/Button";
import { Card } from "@/comps/ui/Card";
import { SummaryTile } from "@/comps/ui/SummaryTile";
import { StoreLevelTile } from "./StoreLevelTile";

const text = managementText;
const hiringText = text.hiring;

function Fact({ label, value }: { label: string; value: string }) {
	return (
		<div className="bg-bg flex flex-col rounded-md px-2.5 py-1.5">
			<span className="text-muted text-xs">{label}</span>
			<span className="font-mono font-medium">{value}</span>
		</div>
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
	const titleId = useId();
	const role = hiringText.roles[roleId];
	const name = `${role.one} ${employeeNumber(employee)}`;
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
					<h4 id={titleId} className="font-semibold">
						{name}
					</h4>
					<span className="text-muted font-mono text-xs">{employee.id}</span>
				</div>
				{hired && <Badge tone="kept">{hiringText.hiredBadge}</Badge>}
			</div>
			{role.stat && employee.stat !== undefined && (
				<p>
					<span className="text-muted">{role.stat}: </span>
					<span className="font-mono font-medium">{employee.stat.toLocaleString()}</span>
				</p>
			)}
			<div className="grid grid-cols-3 gap-2">
				<Fact label={hiringText.level} value={String(employee.storeLevel)} />
				<Fact label={hiringText.cost} value={formatMoney(employee.hiringCost)} />
				<Fact
					label={hiringText.wage}
					value={hiringText.perDay(formatMoney(employee.dailyWage))}
				/>
			</div>
			{hired ? (
				<Button variant="danger" onClick={() => onFire(name)}>
					{hiringText.fire}
				</Button>
			) : reachable ? (
				<Button variant="primary" onClick={() => onHire(name)}>
					{hiringText.hire}
				</Button>
			) : (
				<>
					<LockReason reasons={[text.requiresLevel(employee.storeLevel, level)]} />
					<Button disabled>{text.locked}</Button>
				</>
			)}
		</Card>
	);
}

export function HiringTab({ playthrough }: { playthrough: Playthrough }) {
	const { add, remove } = useListEdit(playthrough.id, "hiredEmployees");
	const totals = hiringTotals(allEmployees, playthrough);

	return (
		<div className="flex flex-col gap-6">
			<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
				<div className="col-span-2 lg:col-span-1">
					<SummaryTile
						label={hiringText.dailyWages}
						value={formatMoney(totals.dailyWages)}
						caption={hiringText.dailyWagesCaption}
						emphasis
					/>
				</div>
				<SummaryTile label={hiringText.hired} value={totals.hired} total={totals.total} />
				<SummaryTile
					label={hiringText.hiringCosts}
					value={formatMoney(totals.hiringCosts)}
					caption={hiringText.hiringCostsCaption}
				/>
				<StoreLevelTile playthrough={playthrough} />
			</div>
			{roles.map((role) => {
				const roleTotals = hiringTotals(role.employees, playthrough);
				return (
					<section key={role.id} className="flex flex-col gap-3">
						<div className="flex flex-wrap items-baseline justify-between gap-2">
							<h3 className="text-lg font-semibold">
								{hiringText.roles[role.id].title}
								<span className="text-muted ms-2 font-mono text-sm font-normal">
									{hiringText.hiredOf(roleTotals.hired, roleTotals.total)}
								</span>
							</h3>
							{roleTotals.dailyWages > 0 && (
								<span className="font-mono">
									{hiringText.roleWages(formatMoney(roleTotals.dailyWages))}
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
									onHire={(name) =>
										add([employee.id], hiringText.hiredToast(name))
									}
									onFire={(name) =>
										remove([employee.id], hiringText.firedToast(name))
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
