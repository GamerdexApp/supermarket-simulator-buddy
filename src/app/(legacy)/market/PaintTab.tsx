import { Card } from "flowbite-react";
import { market } from "@/data/supermarket-simulator/market";

export function PaintTab() {
	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
				All Paint ({market.paints.length})
			</h2>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{market.paints.map((paint, index) => (
					<Card key={index}>
						<div className="flex items-center gap-4">
							{paint.imageUrl && (
								<img
									src={paint.imageUrl}
									alt={paint.name}
									className="h-24 w-24 shrink-0 object-contain"
								/>
							)}
							<div className="flex flex-col">
								<h3 className="text-lg font-bold text-gray-900 dark:text-white">
									{paint.name}
								</h3>
								<div className="mt-2 text-xl font-semibold text-blue-600 dark:text-blue-400">
									${paint.unitPrice.toLocaleString()}
								</div>
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
