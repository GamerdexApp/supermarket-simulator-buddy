"use client";

import type { Product } from "@/types";
import type { Playthrough } from "@/types/playthrough";
import { marketText } from "@/lib/messages/market";
import { isProductUnlocked, labelOf, licenseLabel } from "@/service/market";
import { Button, ButtonLink } from "@/comps/ui/Button";
import { Dialog } from "@/comps/ui/Dialog";
import { ItemImage } from "./ItemImage";

const text = marketText.products;
const detail = text.detail;

interface ProductDetailDialogProps {
	product: Product | null;
	playthrough: Playthrough;
	onClose: () => void;
}

export function ProductDetailDialog({ product, playthrough, onClose }: ProductDetailDialogProps) {
	if (!product) return null;
	const license = licenseLabel(product.licenseId);
	const unlocked = isProductUnlocked(product, playthrough);
	const rows: [string, string][] = [
		[detail.company, product.company ?? detail.none],
		[detail.displayType, labelOf(product.displayType)],
		[detail.category, product.category ? labelOf(product.category) : detail.none],
		...(product.itemsPerBox
			? [[text.itemsPerBox, String(product.itemsPerBox)] as [string, string]]
			: []),
		...(product.weightPerBox
			? [[text.weightPerBox, text.kg(product.weightPerBox)] as [string, string]]
			: []),
		[text.boxesPerStorage, String(product.boxesPerStorage)],
		[detail.boughtAt, product.bigBoxStore ? labelOf(product.bigBoxStore) : detail.none],
		[detail.license, unlocked ? detail.unlocked(license) : detail.locked(license)],
	];

	return (
		<Dialog
			open
			onClose={onClose}
			title={product.name}
			description={product.company}
			footer={
				<>
					<ButtonLink href="/management?tab=licenses">{detail.toLicenses}</ButtonLink>
					<Button variant="primary" onClick={onClose}>
						{detail.close}
					</Button>
				</>
			}
		>
			<div className="flex items-start gap-4">
				<ItemImage src={product.imageUrl} muted={!unlocked} />
				<dl className="grid flex-1 grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
					{rows.map(([label, value]) => (
						<div key={label} className="contents">
							<dt className="text-muted">{label}</dt>
							<dd className="font-medium">{value}</dd>
						</div>
					))}
				</dl>
			</div>
		</Dialog>
	);
}
