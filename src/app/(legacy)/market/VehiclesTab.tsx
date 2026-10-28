import { Badge, Button, Card } from "flowbite-react";
import { HiCheckCircle, HiLockClosed } from "react-icons/hi";
import type { VehiclesTabProps } from "@/types";
import { market } from "@/data/supermarket-simulator/market";

export function VehiclesTab({ activePlaythrough, onUnlockVehicle }: VehiclesTabProps) {
	const currentStoreLevel = activePlaythrough.storeLevel ?? 0;
	const unlockedVehicles = activePlaythrough.unlockedVehicles || [];

	const isVehicleUnlocked = (vehicleName: string) => {
		return unlockedVehicles.includes(vehicleName);
	};

	const totalSpent = market.vehicles
		.filter((vehicle) => isVehicleUnlocked(vehicle.name))
		.reduce((sum, vehicle) => sum + vehicle.unitPrice, 0);

	return (
		<div className="space-y-6">
			<Card>
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-xl font-bold text-gray-900 dark:text-white">
							Total Spent on Vehicles
						</h3>
						<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
							{unlockedVehicles.length} of {market.vehicles.length} vehicles unlocked
						</p>
					</div>
					<div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
						${totalSpent.toLocaleString()}
					</div>
				</div>
			</Card>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{market.vehicles.map((vehicle, index) => {
					const unlocked = isVehicleUnlocked(vehicle.name);
					const meetsLevel = currentStoreLevel >= vehicle.storeLevel;

					return (
						<Card key={index} className="relative">
							{unlocked && (
								<Badge
									color="success"
									className="absolute top-4 right-4"
									icon={HiCheckCircle}
								>
									Unlocked
								</Badge>
							)}

							<div className="flex gap-4">
								{vehicle.imageUrl && (
									<img
										src={vehicle.imageUrl}
										alt={vehicle.name}
										className="h-24 w-24 shrink-0 object-contain"
									/>
								)}
								<div className="flex flex-1 flex-col">
									<h3 className="text-lg font-bold text-gray-900 dark:text-white">
										{vehicle.name}
									</h3>
									<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
										{vehicle.description}
									</p>
									<div className="mt-3 space-y-2 text-sm">
										<div className="flex items-center justify-between gap-4">
											<span className="text-gray-600 dark:text-gray-400">
												Price:
											</span>
											<span className="font-semibold text-blue-600 dark:text-blue-400">
												${vehicle.unitPrice.toLocaleString()}
											</span>
										</div>
										<div className="flex items-center justify-between gap-4">
											<span className="text-gray-600 dark:text-gray-400">
												Store Level:
											</span>
											<span className="font-semibold text-gray-900 dark:text-white">
												{vehicle.storeLevel}
											</span>
										</div>
									</div>

									<div className="mt-4">
										{unlocked ? (
											<Button color="gray" disabled className="w-full">
												Already Unlocked
											</Button>
										) : (
											<div>
												{!meetsLevel && (
													<p className="mb-2 text-sm text-red-600 dark:text-red-400">
														Store level {vehicle.storeLevel} required
														(currently {currentStoreLevel})
													</p>
												)}
												<Button
													color="blue"
													onClick={() => onUnlockVehicle(vehicle.name)}
													disabled={!meetsLevel}
													className="w-full"
												>
													{meetsLevel ? (
														"Unlock"
													) : (
														<>
															<HiLockClosed className="mr-2 h-4 w-4" />
															Locked
														</>
													)}
												</Button>
											</div>
										)}
									</div>
								</div>
							</div>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
