import { Badge, Button, Card } from "flowbite-react";
import { HiCheckCircle, HiLockClosed } from "react-icons/hi";
import type { StorageTabProps } from "@/types";
import { management } from "@/data/supermarket-simulator/management";

export function StorageTab({ activePlaythrough, onUnlockStorage, onLockStorage }: StorageTabProps) {
	const currentStoreLevel = activePlaythrough.storeLevel ?? 0;
	const unlockedStorage = activePlaythrough.unlockedStorage || [];

	const isStorageUnlocked = (sectionNum: string) => {
		return unlockedStorage.includes(sectionNum);
	};

	const canUnlockStorage = (index: number, storeLevel: number) => {
		if (currentStoreLevel < storeLevel) return false;
		if (index === 0) return true;
		const previousSection = management.storage[index - 1];
		return isStorageUnlocked(previousSection.sectionNum);
	};

	const totalSpent = management.storage
		.filter((storage) => isStorageUnlocked(storage.sectionNum))
		.reduce((sum, storage) => sum + storage.price, 0);

	return (
		<div className="space-y-6">
			<Card>
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-xl font-bold text-gray-900 dark:text-white">
							Total Spent on Storage
						</h3>
						<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
							{unlockedStorage.length} of {management.storage.length} sections
							unlocked
						</p>
					</div>
					<div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
						${totalSpent.toLocaleString()}
					</div>
				</div>
			</Card>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{management.storage.map((storage, index) => {
					const unlocked = isStorageUnlocked(storage.sectionNum);
					const canUnlock = canUnlockStorage(index, storage.storeLevel);

					return (
						<Card key={storage.sectionNum}>
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<h3 className="text-lg font-bold text-gray-900 dark:text-white">
										Storage Section {storage.sectionNum}
									</h3>
									<div className="mt-2 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
										<span>Store Level: {storage.storeLevel}</span>
										<span>
											Price:{" "}
											{storage.price === 0
												? "Free"
												: `$${storage.price.toLocaleString()}`}
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
												onClick={() => onLockStorage(storage.sectionNum)}
											>
												Undo
											</Button>
										</>
									) : (
										<Button
											color="blue"
											size="sm"
											onClick={() => onUnlockStorage(storage.sectionNum)}
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
