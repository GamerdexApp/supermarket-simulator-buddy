import { Card } from "flowbite-react";
import { management } from "@/data/supermarket-simulator/management";

export function CustomizationsTab() {
	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{management.customizations.map((customization, index) => (
				<Card key={index}>
					<h3 className="text-xl font-bold text-gray-900 dark:text-white">
						{customization.name}
					</h3>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						{customization.description}
					</p>
					<div className="text-lg font-semibold text-gray-900 dark:text-white">
						<span className="text-gray-600 dark:text-gray-400">Price:</span> $
						{customization.price.toLocaleString()}
					</div>
				</Card>
			))}
		</div>
	);
}
