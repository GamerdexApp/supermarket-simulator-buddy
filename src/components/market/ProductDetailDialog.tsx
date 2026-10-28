"use client";

import { useTranslations } from "next-intl";
import type { Product } from "@/types";
import type { Playthrough } from "@/types/playthrough";
import { formatNumber } from "@/lib/format";
import { licenseIdNumber } from "@/service/management";
import { isProductUnlocked, productTags } from "@/service/market";
import { Button, ButtonLink } from "@/comps/ui/Button";
import { Dialog } from "@/comps/ui/Dialog";
import { ItemImage } from "./ItemImage";

interface ProductDetailDialogProps {
	product: Product | null;
	playthrough: Playthrough;
	onClose: () => void;
}

export function ProductDetailDialog({ product, playthrough, onClose }: ProductDetailDialogProps) {
	const t = useTranslations("market.products");
	const terms = useTranslations("terms");
	if (!product) return null;
	const number = licenseIdNumber(product.licenseId);
	const unlocked = isProductUnlocked(product, playthrough);
	const tags = productTags(product);
	const none = t("detail.none");
	const rows: [string, string][] = [
		[t("detail.company"), product.company ?? none],
		[t("detail.displayType"), terms(`displayTypes.${tags.displayType}`)],
		[t("detail.category"), tags.category ? terms(`categories.${tags.category}`) : none],
		...(product.itemsPerBox
			? [[t("itemsPerBox"), formatNumber(product.itemsPerBox)] as [string, string]]
			: []),
		...(product.weightPerBox
			? [
					[
						t("weightPerBox"),
						t("kg", { weight: formatNumber(product.weightPerBox) }),
					] as [string, string],
				]
			: []),
		[t("boxesPerStorage"), formatNumber(product.boxesPerStorage)],
		[t("detail.boughtAt"), tags.store ? t(`stores.${tags.store}`) : none],
		[
			t("detail.license"),
			unlocked ? t("detail.unlocked", { number }) : t("detail.locked", { number }),
		],
	];

	return (
		<Dialog
			open
			onClose={onClose}
			title={product.name}
			description={product.company}
			footer={
				<>
					<ButtonLink href="/management?tab=licenses">
						{t("detail.toLicenses")}
					</ButtonLink>
					<Button variant="primary" onClick={onClose}>
						{t("detail.close")}
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
