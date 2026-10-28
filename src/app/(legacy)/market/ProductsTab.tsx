import { Badge, Card, Label, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import { HiSearch } from "react-icons/hi";
import type { ProductsTabProps } from "@/types";
import { CATEGORIES, DISPLAY_TYPES } from "@/data/constants/supermarket-simulator";
import { market } from "@/data/supermarket-simulator/market";

export function ProductsTab({ activePlaythrough }: ProductsTabProps) {
	const unlockedLicenses = activePlaythrough.unlockedLicenses || [];
	const [searchTerm, setSearchTerm] = useState("");
	const [displayFilter, setDisplayFilter] = useState("all");
	const [categoryFilter, setCategoryFilter] = useState("all");

	const capitalize = (str: string) =>
		str
			.replace(/_/g, " ")
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");

	const filterProducts = (products: typeof market.products) => {
		return products.filter((product) => {
			const matchesSearch =
				product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.company?.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesDisplay = displayFilter === "all" || product.displayType === displayFilter;
			const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;

			return matchesSearch && matchesDisplay && matchesCategory;
		});
	};

	const unlockedProducts = filterProducts(
		market.products.filter((product) => unlockedLicenses.includes(product.licenseId))
	);

	const lockedProducts = filterProducts(
		market.products.filter((product) => !unlockedLicenses.includes(product.licenseId))
	);

	const renderProductCard = (product: (typeof market.products)[0], unlocked: boolean) => (
		<Card key={product.name + product.company} className={unlocked ? "" : "opacity-60"}>
			<div className="flex gap-4">
				{product.imageUrl && (
					<div className="shrink-0">
						<img
							src={product.imageUrl}
							alt={product.name}
							className={`h-24 w-24 object-contain ${!unlocked ? "grayscale" : ""}`}
						/>
					</div>
				)}
				<div className="flex-1">
					<div className="mb-2 flex items-start justify-between gap-2">
						<div>
							<h3 className="text-lg font-bold text-gray-900 dark:text-white">
								{product.name}
							</h3>
							{product.company && (
								<p className="text-sm text-gray-600 dark:text-gray-400">
									{product.company}
								</p>
							)}
						</div>
						<div className="flex shrink-0 gap-1">
							<Badge color="blue" className="text-xs">
								{capitalize(product.displayType)}
							</Badge>
							<Badge color="purple" className="text-xs">
								{capitalize(product.category)}
							</Badge>
						</div>
					</div>

					<div className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-400">
						{product.itemsPerBox && (
							<div className="flex justify-between gap-4">
								<span>Items/Box:</span>
								<span className="font-medium">{product.itemsPerBox}</span>
							</div>
						)}
						{product.weightPerBox && product.weightPerBox > 0 && (
							<div className="flex justify-between gap-4">
								<span>Weight/Box:</span>
								<span className="font-medium">{product.weightPerBox}kg</span>
							</div>
						)}
						<div className="flex justify-between gap-4">
							<span>Boxes/Storage:</span>
							<span className="font-medium">{product.boxesPerStorage}</span>
						</div>
					</div>

					{!unlocked && (
						<div className="mt-3 text-xs text-red-600 dark:text-red-400">
							Requires: {product.licenseId.replace("_", " ").toUpperCase()}
						</div>
					)}
				</div>
			</div>
		</Card>
	);

	return (
		<div className="space-y-6">
			<Card>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div>
						<div className="mb-2 block">
							<Label htmlFor="search">Search Products</Label>
						</div>
						<TextInput
							id="search"
							type="text"
							icon={HiSearch}
							placeholder="Search by name or company..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<div>
						<div className="mb-2 block">
							<Label htmlFor="display">Filter by Display Type</Label>
						</div>
						<Select
							id="display"
							value={displayFilter}
							onChange={(e) => setDisplayFilter(e.target.value)}
						>
							<option value="all">All Display Types</option>
							{DISPLAY_TYPES.map((type) => (
								<option key={type} value={type}>
									{capitalize(type)}
								</option>
							))}
						</Select>
					</div>
					<div>
						<div className="mb-2 block">
							<Label htmlFor="category">Filter by Category</Label>
						</div>
						<Select
							id="category"
							value={categoryFilter}
							onChange={(e) => setCategoryFilter(e.target.value)}
						>
							<option value="all">All Categories</option>
							{CATEGORIES.map((cat) => (
								<option key={cat} value={cat}>
									{capitalize(cat)}
								</option>
							))}
						</Select>
					</div>
				</div>
			</Card>

			<div>
				<h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
					Unlocked Products ({unlockedProducts.length})
				</h2>
				{unlockedProducts.length === 0 ? (
					<p className="text-gray-600 dark:text-gray-400">
						No unlocked products match your filters.
					</p>
				) : (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
						{unlockedProducts.map((product) => renderProductCard(product, true))}
					</div>
				)}
			</div>

			<div>
				<h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
					Locked Products ({lockedProducts.length})
				</h2>
				{lockedProducts.length === 0 ? (
					<p className="text-gray-600 dark:text-gray-400">
						No locked products match your filters.
					</p>
				) : (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
						{lockedProducts.map((product) => renderProductCard(product, false))}
					</div>
				)}
			</div>
		</div>
	);
}
