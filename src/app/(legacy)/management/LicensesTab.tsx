import { Badge, Button, Card } from "flowbite-react";
import { HiCheckCircle, HiLockClosed } from "react-icons/hi";
import type { LicensesTabProps } from "@/types";
import { management } from "@/data/supermarket-simulator/management";
import { market } from "@/data/supermarket-simulator/market";

export function LicensesTab({
	activePlaythrough,
	onUnlockLicense,
	onLockLicense,
}: LicensesTabProps) {
	const currentStoreLevel = activePlaythrough.storeLevel ?? 0;
	const unlockedLicenses = activePlaythrough.unlockedLicenses || [];

	const isLicenseUnlocked = (licenseId: string) => {
		return unlockedLicenses.includes(licenseId);
	};

	const getProductsForLicense = (licenseId: string) => {
		return market.products.filter((p) => p.licenseId === licenseId);
	};

	const totalSpent = management.licenses
		.filter((license) => isLicenseUnlocked(license.id))
		.reduce((sum, license) => sum + license.price, 0);

	return (
		<div className="space-y-6">
			<Card>
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-xl font-bold text-gray-900 dark:text-white">
							Total Spent on Licenses
						</h3>
						<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
							{unlockedLicenses.length} of {management.licenses.length} licenses
							unlocked
						</p>
					</div>
					<div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
						${totalSpent.toLocaleString()}
					</div>
				</div>
			</Card>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{management.licenses.map((license) => {
					const unlocked = isLicenseUnlocked(license.id);
					const meetsLevel = currentStoreLevel >= license.storeLevel;
					const products = getProductsForLicense(license.id);

					return (
						<Card key={license.id} className="relative">
							{unlocked && (
								<Badge
									color="success"
									className="absolute top-4 right-4"
									icon={HiCheckCircle}
								>
									Unlocked
								</Badge>
							)}

							<h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
								{license.id.replace("_", " ").toUpperCase()}
							</h3>

							<div className="mb-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
								<div className="flex justify-between">
									<span className="font-medium">Price:</span>
									<span>
										{license.price === 0
											? "Free"
											: `$${license.price.toLocaleString()}`}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium">Store Level:</span>
									<span>{license.storeLevel}</span>
								</div>
							</div>

							<div className="mb-4">
								<h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
									Unlocks {products.length} Products:
								</h4>
								<div className="max-h-48 space-y-1 overflow-y-auto text-xs text-gray-600 dark:text-gray-400">
									{products.map((product, idx) => (
										<div key={idx}>
											{product.company
												? `${product.company} - ${product.name}`
												: product.name}
										</div>
									))}
								</div>
							</div>

							{unlocked ? (
								<div className="flex gap-2">
									<Button color="gray" disabled className="flex-1">
										Already Unlocked
									</Button>
									<Button
										color="red"
										outline
										onClick={() => onLockLicense(license.id)}
										className="flex-1"
									>
										Undo
									</Button>
								</div>
							) : (
								<div>
									{!meetsLevel && (
										<p className="mb-2 text-sm text-red-600 dark:text-red-400">
											Store level {license.storeLevel} required (currently{" "}
											{currentStoreLevel})
										</p>
									)}
									<Button
										color="blue"
										onClick={() => onUnlockLicense(license.id)}
										disabled={!meetsLevel}
										className="w-full"
									>
										{meetsLevel ? (
											"Unlock License"
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
	);
}
