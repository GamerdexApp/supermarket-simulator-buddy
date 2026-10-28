import { Badge, Button, Card } from "flowbite-react";
import { HiCheckCircle, HiLockClosed } from "react-icons/hi";
import type { GrowthTabProps } from "@/types";
import { management } from "@/data/supermarket-simulator/management";

export function GrowthTab({ activePlaythrough, onUnlockGrowth, onLockGrowth }: GrowthTabProps) {
	const currentStoreLevel = activePlaythrough.storeLevel ?? 0;
	const unlockedGrowth = activePlaythrough.unlockedGrowth || [];

	const isGrowthUnlocked = (sectionNum: string) => {
		return unlockedGrowth.includes(sectionNum);
	};

	const canUnlockGrowth = (index: number, storeLevel: number) => {
		if (currentStoreLevel < storeLevel) return false;
		if (index === 0) return true;
		const previousSection = management.growth[index - 1];
		return isGrowthUnlocked(previousSection.sectionNum);
	};

	const totalSpent = management.growth
		.filter((growth) => isGrowthUnlocked(growth.sectionNum))
		.reduce((sum, growth) => sum + growth.price, 0);

	return (
		<div className="space-y-6">
			<Card>
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-xl font-bold text-gray-900 dark:text-white">
							Total Spent on Growth
						</h3>
						<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
							{unlockedGrowth.length} of {management.growth.length} sections unlocked
						</p>
					</div>
					<div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
						${totalSpent.toLocaleString()}
					</div>
				</div>
			</Card>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{management.growth.map((growth, index) => {
					const unlocked = isGrowthUnlocked(growth.sectionNum);
					const canUnlock = canUnlockGrowth(index, growth.storeLevel);

					return (
						<Card key={growth.sectionNum}>
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<h3 className="text-lg font-bold text-gray-900 dark:text-white">
										Growth Section {growth.sectionNum}
									</h3>
									<div className="mt-2 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
										<span>Store Level: {growth.storeLevel}</span>
										<span>
											Price:{" "}
											{growth.price === 0
												? "Free"
												: `$${growth.price.toLocaleString()}`}
										</span>
										<span>Size: 4x4</span>
									</div>
								</div>

								<div className="ml-4 flex gap-2">
									{unlocked ? (
										<>
											<Badge
												color="success"
												icon={HiCheckCircle}
												className="text-sm"
											>
												Unlocked
											</Badge>
											<Button
												color="red"
												outline
												size="sm"
												onClick={() => onLockGrowth(growth.sectionNum)}
											>
												Undo
											</Button>
										</>
									) : (
										<Button
											color="blue"
											size="sm"
											onClick={() => onUnlockGrowth(growth.sectionNum)}
											disabled={!canUnlock}
										>
											{canUnlock ? (
												"Unlock"
											) : (
												<>
													<HiLockClosed className="mr-2 h-4 w-4" />
													Locked
												</>
											)}
										</Button>
									)}
								</div>
							</div>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
