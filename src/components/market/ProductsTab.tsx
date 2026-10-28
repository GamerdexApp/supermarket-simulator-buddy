"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types";
import type { Playthrough } from "@/types/playthrough";
import { marketText } from "@/lib/messages/market";
import {
	ALL,
	categoryOptions,
	displayTypeOptions,
	filterProducts,
	isProductUnlocked,
	labelOf,
	licenseLabel,
	productKey,
} from "@/service/market";
import { market } from "@/data/supermarket-simulator/market";
import { FilterBlock } from "@/comps/page/FilterBlock";
import type { FilterFieldConfig } from "@/comps/page/FilterBlock";
import { Card } from "@/comps/ui/Card";
import { ItemImage } from "./ItemImage";
import { ProductDetailDialog } from "./ProductDetailDialog";

const text = marketText.products;

const fields: FilterFieldConfig[] = [
	{
		id: "displayType",
		label: text.displayType,
		options: [
			{ id: ALL, label: text.allDisplayTypes },
			...displayTypeOptions.map((o) => ({
				id: o.id,
				label: text.option(labelOf(o.id), o.count),
			})),
		],
	},
	{
		id: "category",
		label: text.category,
		options: [
			{ id: ALL, label: text.allCategories },
			...categoryOptions.map((o) => ({
				id: o.id,
				label: text.option(labelOf(o.id), o.count),
			})),
		],
	},
];

const DEFAULT_FILTERS = { displayType: ALL, category: ALL };

function Fact({ label, value }: { label: string; value: string }) {
	return (
		<div className="bg-bg flex flex-col rounded-md px-2.5 py-1.5">
			<span className="text-muted text-xs">{label}</span>
			<span className="font-mono font-medium">{value}</span>
		</div>
	);
}

function Chip({ children, tone }: { children: string; tone: "link" | "muted" }) {
	return (
		<span
			className={`rounded-full border-[1.5px] px-2 py-0.5 text-xs ${tone === "link" ? "border-link text-link" : "border-line text-muted"}`}
		>
			{children}
		</span>
	);
}

function ProductCard({
	product,
	unlocked,
	onOpen,
}: {
	product: Product;
	unlocked: boolean;
	onOpen: () => void;
}) {
	return (
		<Card className={`flex flex-col gap-3 p-4 ${unlocked ? "" : "border-dashed"}`}>
			<div className="flex items-start gap-3">
				<ItemImage src={product.imageUrl} muted={!unlocked} />
				<div className="flex min-w-0 flex-1 flex-col gap-1.5">
					<button
						type="button"
						onClick={onOpen}
						aria-label={text.details(product.name)}
						className="inline-flex min-h-11 w-fit items-center text-start font-semibold hover:underline lg:min-h-0"
					>
						{product.name}
					</button>
					{product.company && <span className="text-muted">{product.company}</span>}
					<span className="flex flex-wrap gap-1.5">
						<Chip tone="link">{labelOf(product.displayType)}</Chip>
						{product.category && <Chip tone="muted">{labelOf(product.category)}</Chip>}
					</span>
				</div>
			</div>
			<div className="grid grid-cols-3 gap-2">
				{product.itemsPerBox ? (
					<Fact label={text.itemsPerBox} value={String(product.itemsPerBox)} />
				) : null}
				{product.weightPerBox ? (
					<Fact label={text.weightPerBox} value={text.kg(product.weightPerBox)} />
				) : null}
				<Fact label={text.boxesPerStorage} value={String(product.boxesPerStorage)} />
			</div>
			{!unlocked && (
				<p className="text-warn">{text.requires(licenseLabel(product.licenseId))}</p>
			)}
		</Card>
	);
}

function ProductSection({
	title,
	help,
	empty,
	products,
	unlocked,
	onOpen,
}: {
	title: string;
	help?: string;
	empty: string;
	products: Product[];
	unlocked: boolean;
	onOpen: (product: Product) => void;
}) {
	return (
		<section className="flex flex-col gap-3">
			<div className="flex flex-col">
				<h2 className="text-xl font-semibold">{title}</h2>
				{help && <p className="text-muted">{help}</p>}
			</div>
			{products.length === 0 ? (
				<p className="text-muted">{empty}</p>
			) : (
				<div className="grid items-start gap-4 md:grid-cols-2 2xl:grid-cols-3">
					{products.map((product) => (
						<ProductCard
							key={productKey(product)}
							product={product}
							unlocked={unlocked}
							onOpen={() => onOpen(product)}
						/>
					))}
				</div>
			)}
		</section>
	);
}

export function ProductsTab({ playthrough }: { playthrough: Playthrough }) {
	const [filters, setFilters] = useState<Record<string, string>>(DEFAULT_FILTERS);
	const [search, setSearch] = useState("");
	const [open, setOpen] = useState<Product | null>(null);

	const visible = useMemo(
		() =>
			filterProducts(market.products, {
				search,
				displayType: filters.displayType,
				category: filters.category,
			}),
		[filters, search]
	);
	const unlocked = visible.filter((product) => isProductUnlocked(product, playthrough));
	const locked = visible.filter((product) => !isProductUnlocked(product, playthrough));

	return (
		<div className="flex flex-col gap-6">
			<FilterBlock
				fields={fields}
				values={filters}
				onChange={(id, value) => setFilters((current) => ({ ...current, [id]: value }))}
				onClear={() => {
					setFilters(DEFAULT_FILTERS);
					setSearch("");
				}}
				search={{ label: text.search, value: search, onChange: setSearch }}
				summary={text.showing(visible.length, market.products.length)}
				flyoutTitle={text.filtersTitle}
				showLabel={text.showButton(visible.length)}
			/>
			<ProductSection
				title={text.unlocked(unlocked.length)}
				empty={text.noUnlocked}
				products={unlocked}
				unlocked
				onOpen={setOpen}
			/>
			<ProductSection
				title={text.locked(locked.length)}
				help={text.lockedHelp}
				empty={text.noLocked}
				products={locked}
				unlocked={false}
				onOpen={setOpen}
			/>
			<ProductDetailDialog
				product={open}
				playthrough={playthrough}
				onClose={() => setOpen(null)}
			/>
		</div>
	);
}
