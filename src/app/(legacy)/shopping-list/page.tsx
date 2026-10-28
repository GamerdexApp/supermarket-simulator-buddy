"use client";

import {
	Badge,
	Button,
	Card,
	Checkbox,
	Label,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeadCell,
	TableRow,
	TextInput,
} from "flowbite-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { HiPlus, HiRefresh, HiSearch, HiTrash } from "react-icons/hi";
import type { PendingItem, ShoppingListItem } from "@/types";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import {
	DELI_AND_GROCERY_LOCATION,
	GREEN_MARKET_LOCATION,
	JANITORIAL_SUPPLY_LOCATION,
	LIQUOR_STORE_LOCATION,
	MEAT_AND_DAIRY_LOCATION,
} from "@/data/constants/supermarket-simulator";
import { market } from "@/data/supermarket-simulator/market";

const formatLocationName = (location: string): string => {
	switch (location) {
		case LIQUOR_STORE_LOCATION:
			return "Liquor Store";
		case JANITORIAL_SUPPLY_LOCATION:
			return "Janitorial Supply";
		case DELI_AND_GROCERY_LOCATION:
			return "Deli and Grocery";
		case MEAT_AND_DAIRY_LOCATION:
			return "Meat and Dairy";
		case GREEN_MARKET_LOCATION:
			return "Green Market";
		case "":
			return "No Shop Available";
		default:
			return location;
	}
};

const getLocationSortOrder = (location: string): number => {
	switch (location) {
		case DELI_AND_GROCERY_LOCATION:
			return 1;
		case MEAT_AND_DAIRY_LOCATION:
			return 2;
		case GREEN_MARKET_LOCATION:
			return 3;
		case LIQUOR_STORE_LOCATION:
			return 4;
		case JANITORIAL_SUPPLY_LOCATION:
			return 5;
		case "":
			return 999;
		default:
			return 500;
	}
};

export default function ShoppingListPage() {
	const { activePlaythrough, updatePlaythrough } = usePlaythrough();

	if (!activePlaythrough) {
		redirect("/");
	}

	const shoppingList = activePlaythrough.shoppingList || [];
	const unlockedLicenses = activePlaythrough.unlockedLicenses || [];

	const availableProducts = market.products.filter((product) =>
		unlockedLicenses.includes(product.licenseId)
	);

	const [showModal, setShowModal] = useState(false);
	const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
	const [searchTerm, setSearchTerm] = useState("");

	const handleAddProduct = (product: (typeof availableProducts)[0]) => {
		const productKey = `${product.name}|${product.company || ""}`;

		const existingItem = pendingItems.find(
			(item) => `${item.productName}|${item.company || ""}` === productKey
		);

		if (existingItem) {
			setPendingItems(
				pendingItems.map((item) =>
					item.id === existingItem.id ? { ...item, boxes: item.boxes + 1 } : item
				)
			);
		} else {
			const store = product.bigBoxStore || "";

			const newPendingItem: PendingItem = {
				id: crypto.randomUUID(),
				productName: product.name,
				company: product.company,
				boxes: 1,
				store,
			};

			setPendingItems([...pendingItems, newPendingItem]);
		}
	};

	const handleRemoveFromPending = (itemId: string) => {
		setPendingItems(pendingItems.filter((item) => item.id !== itemId));
	};

	const handleIncrementBoxes = (itemId: string) => {
		setPendingItems(
			pendingItems.map((item) =>
				item.id === itemId ? { ...item, boxes: item.boxes + 1 } : item
			)
		);
	};

	const handleDecrementBoxes = (itemId: string) => {
		setPendingItems(
			pendingItems.map((item) =>
				item.id === itemId ? { ...item, boxes: Math.max(1, item.boxes - 1) } : item
			)
		);
	};

	const handleSubmitItems = () => {
		const newItems: ShoppingListItem[] = pendingItems.map((item) => ({
			...item,
			purchased: false,
		}));

		updatePlaythrough(activePlaythrough.id, {
			shoppingList: [...shoppingList, ...newItems],
		});

		setPendingItems([]);
		setShowModal(false);
	};

	const handleCancelModal = () => {
		setPendingItems([]);
		setSearchTerm("");
		setShowModal(false);
	};

	const filteredProducts = availableProducts.filter((product) => {
		const searchLower = searchTerm.toLowerCase();
		return (
			product.name.toLowerCase().includes(searchLower) ||
			product.company?.toLowerCase().includes(searchLower)
		);
	});

	const handleTogglePurchased = (itemId: string) => {
		const updatedList = shoppingList.map((item) =>
			item.id === itemId ? { ...item, purchased: !item.purchased } : item
		);

		updatePlaythrough(activePlaythrough.id, {
			shoppingList: updatedList,
		});
	};

	const handleRemoveItem = (itemId: string) => {
		const updatedList = shoppingList.filter((item) => item.id !== itemId);

		updatePlaythrough(activePlaythrough.id, {
			shoppingList: updatedList,
		});
	};

	const handleReset = () => {
		updatePlaythrough(activePlaythrough.id, {
			shoppingList: [],
		});
	};

	const itemsByStore = shoppingList.reduce(
		(acc, item) => {
			if (!acc[item.store]) {
				acc[item.store] = [];
			}
			acc[item.store].push(item);
			return acc;
		},
		{} as Record<string, ShoppingListItem[]>
	);

	const totalItems = shoppingList.length;
	const purchasedItems = shoppingList.filter((item) => item.purchased).length;
	const totalBoxes = shoppingList.reduce((sum, item) => sum + item.boxes, 0);

	return (
		<main className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
			<div className="mx-auto w-full">
				<div className="mb-8 flex items-start justify-between">
					<div>
						<h1 className="text-4xl font-bold text-gray-900 dark:text-white">
							Shopping List
						</h1>
						<p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
							Plan your product purchases for {activePlaythrough.name}
						</p>
					</div>
					<Button color="blue" onClick={() => setShowModal(true)}>
						<HiPlus className="mr-2 h-5 w-5" />
						Add Products
					</Button>
				</div>

				<Modal show={showModal} onClose={handleCancelModal} size="6xl">
					<ModalHeader>Add Products to Shopping List</ModalHeader>
					<ModalBody>
						<div className="space-y-4">
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
								<h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
									Click a Product to Add
								</h3>
								<div className="max-h-96 overflow-y-auto rounded-lg border border-gray-200 p-4 dark:border-gray-700">
									{filteredProducts.length === 0 ? (
										<p className="text-center text-gray-600 dark:text-gray-400">
											No products found matching &quot;{searchTerm}&quot;
										</p>
									) : (
										<div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
											{filteredProducts.map((product, index) => {
												const productKey = `${product.name}|${product.company || ""}`;
												const pendingItem = pendingItems.find(
													(item) =>
														`${item.productName}|${item.company || ""}` ===
														productKey
												);
												const boxCount = pendingItem?.boxes || 0;

												return (
													<button
														key={index}
														type="button"
														onClick={() => handleAddProduct(product)}
														className="relative rounded-lg border-2 border-gray-200 bg-white p-3 text-left transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
													>
														{boxCount > 0 && (
															<Badge
																color="success"
																className="absolute top-2 right-2"
															>
																{boxCount}
															</Badge>
														)}
														{product.imageUrl && (
															<img
																src={product.imageUrl}
																alt={product.name}
																className="mb-2 h-16 w-full object-contain"
															/>
														)}
														<div className="text-sm font-medium text-gray-900 dark:text-white">
															{product.name}
														</div>
														{product.company && (
															<div className="text-xs text-gray-600 dark:text-gray-400">
																{product.company}
															</div>
														)}
													</button>
												);
											})}
										</div>
									)}
								</div>
							</div>

							{pendingItems.length > 0 && (
								<div>
									<h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
										Items to Add ({pendingItems.length})
									</h3>
									<div className="overflow-x-auto">
										<Table>
											<TableHead>
												<TableRow>
													<TableHeadCell>Product</TableHeadCell>
													<TableHeadCell>Boxes</TableHeadCell>
													<TableHeadCell>Store</TableHeadCell>
													<TableHeadCell>
														<span className="sr-only">Actions</span>
													</TableHeadCell>
												</TableRow>
											</TableHead>
											<TableBody className="divide-y">
												{pendingItems.map((item) => (
													<TableRow key={item.id}>
														<TableCell>
															<div>
																<div className="font-medium text-gray-900 dark:text-white">
																	{item.productName}
																</div>
																{item.company && (
																	<div className="text-sm text-gray-600 dark:text-gray-400">
																		{item.company}
																	</div>
																)}
															</div>
														</TableCell>
														<TableCell>
															<div className="flex items-center gap-2">
																<Button
																	color="light"
																	size="xs"
																	onClick={() =>
																		handleDecrementBoxes(
																			item.id
																		)
																	}
																	disabled={item.boxes <= 1}
																>
																	-
																</Button>
																<span className="w-8 text-center font-medium">
																	{item.boxes}
																</span>
																<Button
																	color="light"
																	size="xs"
																	onClick={() =>
																		handleIncrementBoxes(
																			item.id
																		)
																	}
																>
																	+
																</Button>
															</div>
														</TableCell>
														<TableCell>
															{formatLocationName(item.store)}
														</TableCell>
														<TableCell>
															<Button
																color="light"
																size="sm"
																onClick={() =>
																	handleRemoveFromPending(item.id)
																}
															>
																<HiTrash className="h-4 w-4" />
															</Button>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								</div>
							)}

							{pendingItems.length === 0 && (
								<p className="text-center text-gray-600 dark:text-gray-400">
									No items added yet. Select a product and click the + button to
									add items.
								</p>
							)}
						</div>
					</ModalBody>
					<ModalFooter>
						<Button color="gray" onClick={handleCancelModal}>
							Cancel
						</Button>
						<Button
							color="blue"
							onClick={handleSubmitItems}
							disabled={pendingItems.length === 0}
						>
							Add {pendingItems.length} Item{pendingItems.length !== 1 ? "s" : ""} to
							List
						</Button>
					</ModalFooter>
				</Modal>

				{shoppingList.length > 0 && (
					<Card className="mb-6">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-xl font-bold text-gray-900 dark:text-white">
									Shopping Summary
								</h3>
								<div className="mt-2 flex gap-4">
									<Badge color="info" className="text-sm">
										{purchasedItems} / {totalItems} items purchased
									</Badge>
									<Badge color="purple" className="text-sm">
										{totalBoxes} total boxes
									</Badge>
								</div>
							</div>
							<Button color="red" onClick={handleReset}>
								<HiRefresh className="mr-2 h-5 w-5" />
								Reset List
							</Button>
						</div>
					</Card>
				)}

				{shoppingList.length === 0 ? (
					<Card>
						<p className="text-center text-gray-600 dark:text-gray-400">
							No items in your shopping list. Add products above to get started.
						</p>
					</Card>
				) : (
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						{Object.keys(itemsByStore)
							.sort((a, b) => getLocationSortOrder(a) - getLocationSortOrder(b))
							.map((store) => (
								<Card key={store}>
									<div className="mb-4 flex items-center justify-between">
										<h3 className="text-2xl font-bold text-gray-900 dark:text-white">
											{formatLocationName(store)}
										</h3>
										<Badge color="gray">
											{itemsByStore[store].length} items
										</Badge>
									</div>
									<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
										{itemsByStore[store].map((item) => (
											<div
												key={item.id}
												className={`flex flex-col rounded-lg border p-4 ${
													item.purchased
														? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
														: "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
												}`}
											>
												<div className="flex items-start gap-3">
													<Checkbox
														checked={item.purchased}
														onChange={() =>
															handleTogglePurchased(item.id)
														}
														className="mt-1"
													/>
													<div className="flex-1">
														<p
															className={`font-medium ${
																item.purchased
																	? "text-gray-500 line-through dark:text-gray-400"
																	: "text-gray-900 dark:text-white"
															}`}
														>
															{item.productName}
															{item.company && ` - ${item.company}`}
														</p>
														<p className="text-sm text-gray-600 dark:text-gray-400">
															{item.boxes} box
															{item.boxes > 1 ? "es" : ""}
														</p>
													</div>
													<Button
														color="light"
														size="xs"
														onClick={() => handleRemoveItem(item.id)}
													>
														<HiTrash className="h-4 w-4" />
													</Button>
												</div>
											</div>
										))}
									</div>
								</Card>
							))}
					</div>
				)}
			</div>
		</main>
	);
}
