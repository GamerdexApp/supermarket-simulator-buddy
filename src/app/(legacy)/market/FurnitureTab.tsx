import { Card } from "flowbite-react";
import { market } from "@/data/supermarket-simulator/market";

export function FurnitureTab() {
	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
				All Furniture ({market.furnitures.length})
			</h2>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{market.furnitures.map((furniture, index) => (
					<Card key={index}>
						<div className="flex items-center gap-4">
							{furniture.imageUrl && (
								<img
									src={furniture.imageUrl}
									alt={furniture.name}
									className="h-24 w-24 shrink-0 object-contain"
								/>
							)}
							<div className="flex flex-col">
								<h3 className="text-lg font-bold text-gray-900 dark:text-white">
									{furniture.name}
								</h3>
								<div className="mt-2 text-xl font-semibold text-blue-600 dark:text-blue-400">
									${furniture.unitPrice.toLocaleString()}
								</div>
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
