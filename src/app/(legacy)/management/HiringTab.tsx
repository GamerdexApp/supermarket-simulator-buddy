import { Badge, Button, Card } from "flowbite-react";
import { HiCheckCircle, HiLockClosed } from "react-icons/hi";
import type { HiringTabProps } from "@/types";
import { management } from "@/data/supermarket-simulator/management";

export function HiringTab({ activePlaythrough, onHireEmployee, onFireEmployee }: HiringTabProps) {
	const currentStoreLevel = activePlaythrough.storeLevel ?? 0;
	const hiredEmployees = activePlaythrough.hiredEmployees || [];

	const isEmployeeHired = (employeeId: string) => {
		return hiredEmployees.includes(employeeId);
	};

	const cashiersDailyWage = management.hiring.cashiers
		.filter((c) => isEmployeeHired(c.id))
		.reduce((sum, c) => sum + c.dailyWage, 0);

	const restockersDailyWage = management.hiring.restockers
		.filter((r) => isEmployeeHired(r.id))
		.reduce((sum, r) => sum + r.dailyWage, 0);

	const helpersDailyWage = management.hiring.customerHelpers
		.filter((h) => isEmployeeHired(h.id))
		.reduce((sum, h) => sum + h.dailyWage, 0);

	const guardsDailyWage = management.hiring.securityGuards
		.filter((g) => isEmployeeHired(g.id))
		.reduce((sum, g) => sum + g.dailyWage, 0);

	const janitorsDailyWage = management.hiring.janitors
		.filter((j) => isEmployeeHired(j.id))
		.reduce((sum, j) => sum + j.dailyWage, 0);

	const totalDailyWage =
		cashiersDailyWage +
		restockersDailyWage +
		helpersDailyWage +
		guardsDailyWage +
		janitorsDailyWage;

	return (
		<div className="space-y-8">
			<Card>
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-xl font-bold text-gray-900 dark:text-white">
							Total Daily Wages
						</h3>
						<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
							Combined daily cost for all hired employees
						</p>
					</div>
					<div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
						${totalDailyWage.toLocaleString()}
					</div>
				</div>
			</Card>

			<div>
				<div className="mb-4 flex items-center justify-between">
					<h3 className="text-2xl font-bold text-gray-900 dark:text-white">Cashiers</h3>
					{cashiersDailyWage > 0 && (
						<div className="text-sm text-gray-600 dark:text-gray-400">
							Daily Wages: ${cashiersDailyWage.toLocaleString()}
						</div>
					)}
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{management.hiring.cashiers.map((cashier) => {
						const hired = isEmployeeHired(cashier.id);
						const meetsLevel = currentStoreLevel >= cashier.storeLevel;

						return (
							<Card key={cashier.id} className="relative">
								{hired && (
									<Badge
										color="success"
										className="absolute top-4 right-4"
										icon={HiCheckCircle}
									>
										Hired
									</Badge>
								)}

								<h4 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
									{cashier.id.replaceAll("_", " ").toUpperCase()}
								</h4>

								<div className="mb-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
									<div className="flex justify-between">
										<span>Complete Checkout:</span>
										<span>{cashier.completeCheckout}</span>
									</div>
									<div className="flex justify-between">
										<span>Store Level:</span>
										<span>{cashier.storeLevel}</span>
									</div>
									<div className="flex justify-between">
										<span>Hiring Cost:</span>
										<span>${cashier.hiringCost.toLocaleString()}</span>
									</div>
									<div className="flex justify-between">
										<span>Daily Wage:</span>
										<span>${cashier.dailyWage.toLocaleString()}</span>
									</div>
								</div>

								{hired ? (
									<Button
										color="red"
										onClick={() => onFireEmployee(cashier.id)}
										className="w-full"
									>
										Fire
									</Button>
								) : (
									<div>
										{!meetsLevel && (
											<p className="mb-2 text-sm text-red-600 dark:text-red-400">
												Store level {cashier.storeLevel} required (currently{" "}
												{currentStoreLevel})
											</p>
										)}
										<Button
											color="blue"
											onClick={() => onHireEmployee(cashier.id)}
											disabled={!meetsLevel}
											className="w-full"
										>
											{meetsLevel ? (
												"Hire"
											) : (
												<>
													<HiLockClosed className="mr-2 h-4 w-4" />
													Locked
												</>
											)}
										</Button>
									</div>
								)}
							</Card>
						);
					})}
				</div>
			</div>

			<div>
				<div className="mb-4 flex items-center justify-between">
					<h3 className="text-2xl font-bold text-gray-900 dark:text-white">Restockers</h3>
					{restockersDailyWage > 0 && (
						<div className="text-sm text-gray-600 dark:text-gray-400">
							Daily Wages: ${restockersDailyWage.toLocaleString()}
						</div>
					)}
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{management.hiring.restockers.map((restocker) => {
						const hired = isEmployeeHired(restocker.id);
						const meetsLevel = currentStoreLevel >= restocker.storeLevel;

						return (
							<Card key={restocker.id} className="relative">
								{hired && (
									<Badge
										color="success"
										className="absolute top-4 right-4"
										icon={HiCheckCircle}
									>
										Hired
									</Badge>
								)}

								<h4 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
									{restocker.id.replaceAll("_", " ").toUpperCase()}
								</h4>

								<div className="mb-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
									<div className="flex justify-between">
										<span>Number of Racks:</span>
										<span>{restocker.numberOfRacks}</span>
									</div>
									<div className="flex justify-between">
										<span>Store Level:</span>
										<span>{restocker.storeLevel}</span>
									</div>
									<div className="flex justify-between">
										<span>Hiring Cost:</span>
										<span>${restocker.hiringCost.toLocaleString()}</span>
									</div>
									<div className="flex justify-between">
										<span>Daily Wage:</span>
										<span>${restocker.dailyWage.toLocaleString()}</span>
									</div>
								</div>

								{hired ? (
									<Button
										color="red"
										onClick={() => onFireEmployee(restocker.id)}
										className="w-full"
									>
										Fire
									</Button>
								) : (
									<div>
										{!meetsLevel && (
											<p className="mb-2 text-sm text-red-600 dark:text-red-400">
												Store level {restocker.storeLevel} required
												(currently {currentStoreLevel})
											</p>
										)}
										<Button
											color="blue"
											onClick={() => onHireEmployee(restocker.id)}
											disabled={!meetsLevel}
											className="w-full"
										>
											{meetsLevel ? (
												"Hire"
											) : (
												<>
													<HiLockClosed className="mr-2 h-4 w-4" />
													Locked
												</>
											)}
										</Button>
									</div>
								)}
							</Card>
						);
					})}
				</div>
			</div>

			<div>
				<div className="mb-4 flex items-center justify-between">
					<h3 className="text-2xl font-bold text-gray-900 dark:text-white">
						Customer Helpers
					</h3>
					{helpersDailyWage > 0 && (
						<div className="text-sm text-gray-600 dark:text-gray-400">
							Daily Wages: ${helpersDailyWage.toLocaleString()}
						</div>
					)}
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{management.hiring.customerHelpers.map((helper) => {
						const hired = isEmployeeHired(helper.id);
						const meetsLevel = currentStoreLevel >= helper.storeLevel;

						return (
							<Card key={helper.id} className="relative">
								{hired && (
									<Badge
										color="success"
										className="absolute top-4 right-4"
										icon={HiCheckCircle}
									>
										Hired
									</Badge>
								)}

								<h4 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
									{helper.id.replaceAll("_", " ").toUpperCase()}
								</h4>

								<div className="mb-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
									<div className="flex justify-between">
										<span>Number of Checkouts:</span>
										<span>{helper.numberOfCheckouts}</span>
									</div>
									<div className="flex justify-between">
										<span>Store Level:</span>
										<span>{helper.storeLevel}</span>
									</div>
									<div className="flex justify-between">
										<span>Hiring Cost:</span>
										<span>${helper.hiringCost.toLocaleString()}</span>
									</div>
									<div className="flex justify-between">
										<span>Daily Wage:</span>
										<span>${helper.dailyWage.toLocaleString()}</span>
									</div>
								</div>

								{hired ? (
									<Button
										color="red"
										onClick={() => onFireEmployee(helper.id)}
										className="w-full"
									>
										Fire
									</Button>
								) : (
									<div>
										{!meetsLevel && (
											<p className="mb-2 text-sm text-red-600 dark:text-red-400">
												Store level {helper.storeLevel} required (currently{" "}
												{currentStoreLevel})
											</p>
										)}
										<Button
											color="blue"
											onClick={() => onHireEmployee(helper.id)}
											disabled={!meetsLevel}
											className="w-full"
										>
											{meetsLevel ? (
												"Hire"
											) : (
												<>
													<HiLockClosed className="mr-2 h-4 w-4" />
													Locked
												</>
											)}
										</Button>
									</div>
								)}
							</Card>
						);
					})}
				</div>
			</div>

			<div>
				<div className="mb-4 flex items-center justify-between">
					<h3 className="text-2xl font-bold text-gray-900 dark:text-white">
						Security Guards
					</h3>
					{guardsDailyWage > 0 && (
						<div className="text-sm text-gray-600 dark:text-gray-400">
							Daily Wages: ${guardsDailyWage.toLocaleString()}
						</div>
					)}
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{management.hiring.securityGuards.map((guard) => {
						const hired = isEmployeeHired(guard.id);
						const meetsLevel = currentStoreLevel >= guard.storeLevel;

						return (
							<Card key={guard.id} className="relative">
								{hired && (
									<Badge
										color="success"
										className="absolute top-4 right-4"
										icon={HiCheckCircle}
									>
										Hired
									</Badge>
								)}

								<h4 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
									{guard.id.replaceAll("_", " ").toUpperCase()}
								</h4>

								<div className="mb-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
									<div className="flex justify-between">
										<span>Store Level:</span>
										<span>{guard.storeLevel}</span>
									</div>
									<div className="flex justify-between">
										<span>Hiring Cost:</span>
										<span>${guard.hiringCost.toLocaleString()}</span>
									</div>
									<div className="flex justify-between">
										<span>Daily Wage:</span>
										<span>${guard.dailyWage.toLocaleString()}</span>
									</div>
								</div>

								{hired ? (
									<Button
										color="red"
										onClick={() => onFireEmployee(guard.id)}
										className="w-full"
									>
										Fire
									</Button>
								) : (
									<div>
										{!meetsLevel && (
											<p className="mb-2 text-sm text-red-600 dark:text-red-400">
												Store level {guard.storeLevel} required (currently{" "}
												{currentStoreLevel})
											</p>
										)}
										<Button
											color="blue"
											onClick={() => onHireEmployee(guard.id)}
											disabled={!meetsLevel}
											className="w-full"
										>
											{meetsLevel ? (
												"Hire"
											) : (
												<>
													<HiLockClosed className="mr-2 h-4 w-4" />
													Locked
												</>
											)}
										</Button>
									</div>
								)}
							</Card>
						);
					})}
				</div>
			</div>

			<div>
				<div className="mb-4 flex items-center justify-between">
					<h3 className="text-2xl font-bold text-gray-900 dark:text-white">Janitors</h3>
					{janitorsDailyWage > 0 && (
						<div className="text-sm text-gray-600 dark:text-gray-400">
							Daily Wages: ${janitorsDailyWage.toLocaleString()}
						</div>
					)}
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{management.hiring.janitors.map((janitor) => {
						const hired = isEmployeeHired(janitor.id);
						const meetsLevel = currentStoreLevel >= janitor.storeLevel;

						return (
							<Card key={janitor.id} className="relative">
								{hired && (
									<Badge
										color="success"
										className="absolute top-4 right-4"
										icon={HiCheckCircle}
									>
										Hired
									</Badge>
								)}

								<h4 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
									{janitor.id.replaceAll("_", " ").toUpperCase()}
								</h4>

								<div className="mb-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
									<div className="flex justify-between">
										<span>Store Level:</span>
										<span>{janitor.storeLevel}</span>
									</div>
									<div className="flex justify-between">
										<span>Hiring Cost:</span>
										<span>${janitor.hiringCost.toLocaleString()}</span>
									</div>
									<div className="flex justify-between">
										<span>Daily Wage:</span>
										<span>${janitor.dailyWage.toLocaleString()}</span>
									</div>
								</div>

								{hired ? (
									<Button
										color="red"
										onClick={() => onFireEmployee(janitor.id)}
										className="w-full"
									>
										Fire
									</Button>
								) : (
									<div>
										{!meetsLevel && (
											<p className="mb-2 text-sm text-red-600 dark:text-red-400">
												Store level {janitor.storeLevel} required (currently{" "}
												{currentStoreLevel})
											</p>
										)}
										<Button
											color="blue"
											onClick={() => onHireEmployee(janitor.id)}
											disabled={!meetsLevel}
											className="w-full"
										>
											{meetsLevel ? (
												"Hire"
											) : (
												<>
													<HiLockClosed className="mr-2 h-4 w-4" />
													Locked
												</>
											)}
										</Button>
									</div>
								)}
							</Card>
						);
					})}
				</div>
			</div>
		</div>
	);
}
