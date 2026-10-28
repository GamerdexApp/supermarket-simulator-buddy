import { Badge, Button, Card } from "flowbite-react";
import { HiCheckCircle, HiLockClosed } from "react-icons/hi";
import type { ToolsTabProps } from "@/types";
import { market } from "@/data/supermarket-simulator/market";

export function ToolsTab({ activePlaythrough, onUnlockTool }: ToolsTabProps) {
	const unlockedTools = activePlaythrough.unlockedTools || [];

	const isToolUnlocked = (toolName: string) => {
		return unlockedTools.includes(toolName);
	};

	const totalSpent = market.tools
		.filter((tool) => isToolUnlocked(tool.name))
		.reduce((sum, tool) => sum + tool.unitPrice, 0);

	return (
		<div className="space-y-6">
			<Card>
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-xl font-bold text-gray-900 dark:text-white">
							Total Spent on Tools
						</h3>
						<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
							{unlockedTools.length} of {market.tools.length} tools unlocked
						</p>
					</div>
					<div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
						${totalSpent.toLocaleString()}
					</div>
				</div>
			</Card>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{market.tools.map((tool, index) => {
					const unlocked = isToolUnlocked(tool.name);
					const canUnlock = tool.unitPrice === 0 || !unlocked;

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
								{tool.imageUrl && (
									<img
										src={tool.imageUrl}
										alt={tool.name}
										className="h-24 w-24 shrink-0 object-contain"
									/>
								)}
								<div className="flex flex-1 flex-col">
									<h3 className="text-lg font-bold text-gray-900 dark:text-white">
										{tool.name}
									</h3>
									<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
										{tool.description}
									</p>
									{tool.requirement && (
										<p className="mt-2 text-xs text-orange-600 dark:text-orange-400">
											{tool.requirement}
										</p>
									)}
									<div className="mt-2 text-xl font-semibold text-blue-600 dark:text-blue-400">
										{tool.unitPrice === 0
											? "Free"
											: `$${tool.unitPrice.toLocaleString()}`}
									</div>

									<div className="mt-4">
										{unlocked ? (
											<Button color="gray" disabled className="w-full">
												Already Unlocked
											</Button>
										) : (
											<Button
												color="blue"
												onClick={() => onUnlockTool(tool.name)}
												disabled={!canUnlock}
												className="w-full"
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
							</div>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
