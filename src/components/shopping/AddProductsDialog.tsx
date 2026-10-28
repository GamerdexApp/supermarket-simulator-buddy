"use client";

import { useMemo, useState } from "react";
import { LuSearch, LuTrash2 } from "react-icons/lu";
import type { Product } from "@/types";
import type { Playthrough } from "@/types/playthrough";
import { shoppingText } from "@/lib/messages/shopping";
import { productLabel } from "@/service/management";
import { ALL, filterProducts, productKey } from "@/service/market";
import type { PendingItem } from "@/service/shopping";
import { addableProducts, pendingKey, shopName, toPending } from "@/service/shopping";
import { ItemImage } from "@/comps/market/ItemImage";
import { Button } from "@/comps/ui/Button";
import { Dialog } from "@/comps/ui/Dialog";
import { IconButton } from "@/comps/ui/IconButton";
import { Input } from "@/comps/ui/Input";
import { SectionLabel } from "@/comps/ui/SectionLabel";
import { ValueStepper } from "@/comps/ui/ValueStepper";

const text = shoppingText.dialog;

interface DialogContentProps {
	playthrough: Playthrough;
	onClose: () => void;
	onSubmit: (items: PendingItem[]) => void;
}

/** Mounted only while open, so the search and the pending items start empty every time. */
function AddProductsContent({ playthrough, onClose, onSubmit }: DialogContentProps) {
	const [search, setSearch] = useState("");
	const [pending, setPending] = useState<PendingItem[]>([]);
	const products = useMemo(() => addableProducts(playthrough), [playthrough]);
	const visible = filterProducts(products, { search, displayType: ALL, category: ALL });

	const boxesFor = (product: Product) =>
		pending.find((item) => pendingKey(item) === pendingKey(toPending(product)))?.boxes ?? 0;

	const addOne = (product: Product) => {
		const next = toPending(product);
		setPending((current) =>
			current.some((item) => pendingKey(item) === pendingKey(next))
				? current.map((item) =>
						pendingKey(item) === pendingKey(next)
							? { ...item, boxes: item.boxes + 1 }
							: item
					)
				: [...current, next]
		);
	};

	const setBoxes = (key: string, boxes: number) =>
		setPending((current) =>
			current.map((item) => (pendingKey(item) === key ? { ...item, boxes } : item))
		);

	const removePending = (key: string) =>
		setPending((current) => current.filter((item) => pendingKey(item) !== key));

	return (
		<Dialog
			open
			onClose={onClose}
			variant="widest"
			title={shoppingText.dialog.title}
			description={text.source}
			footer={
				<>
					<Button onClick={onClose}>{text.cancel}</Button>
					<Button
						variant="primary"
						disabled={pending.length === 0}
						onClick={() => onSubmit(pending)}
					>
						{text.submit(pending.length)}
					</Button>
				</>
			}
		>
			<div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
				<section className="flex min-w-0 flex-col gap-3">
					<Input
						type="search"
						value={search}
						aria-label={text.search}
						placeholder={text.searchPlaceholder}
						leadingIcon={<LuSearch size={16} aria-hidden="true" />}
						onChange={(event) => setSearch(event.target.value)}
						data-autofocus
					/>
					<div className="flex items-center justify-between gap-2">
						<SectionLabel className="text-muted">{text.pick}</SectionLabel>
						<span className="text-muted font-mono text-xs">
							{text.showing(visible.length, products.length)}
						</span>
					</div>
					{visible.length === 0 ? (
						<div className="flex flex-col items-start gap-1">
							<p>{text.noResults(search)}</p>
							<p className="text-muted">{text.noResultsHint}</p>
							{search && (
								<Button variant="link" onClick={() => setSearch("")}>
									{text.clearSearch}
								</Button>
							)}
						</div>
					) : (
						<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
							{visible.map((product) => {
								const boxes = boxesFor(product);
								return (
									<button
										key={productKey(product)}
										type="button"
										onClick={() => addOne(product)}
										aria-label={text.addOne(productLabel(product))}
										className={`relative flex min-h-11 flex-col items-center gap-1 rounded-md border-[1.5px] p-2 text-center ${
											boxes > 0
												? "border-primary bg-tint"
												: "border-line bg-surface hover:bg-tint"
										}`}
									>
										{boxes > 0 && (
											<span className="bg-primary text-on-primary absolute end-1.5 top-1.5 rounded-full px-1.5 font-mono text-xs">
												+{boxes}
											</span>
										)}
										<ItemImage src={product.imageUrl} />
										<span className="text-sm font-medium">{product.name}</span>
										{product.company && (
											<span className="text-muted text-xs">
												{product.company}
											</span>
										)}
									</button>
								);
							})}
						</div>
					)}
				</section>
				<section className="flex min-w-0 flex-col gap-3">
					<SectionLabel className="text-muted">
						{text.pending(pending.length)}
					</SectionLabel>
					{pending.length === 0 ? (
						<p className="text-muted">{text.noPending}</p>
					) : (
						<>
							<ul className="flex flex-col gap-2">
								{pending.map((item) => {
									const key = pendingKey(item);
									const label = [item.company, item.productName]
										.filter(Boolean)
										.join(" - ");
									return (
										<li
											key={key}
											className="border-line flex flex-col gap-2 rounded-md border-[1.5px] p-3"
										>
											<div className="flex items-start justify-between gap-2">
												<span className="flex min-w-0 flex-col">
													<span className="font-medium">
														{item.productName}
													</span>
													{item.company && (
														<span className="text-muted text-xs">
															{item.company}
														</span>
													)}
												</span>
												<IconButton
													label={text.removePending(label)}
													onClick={() => removePending(key)}
													className="text-danger hover:bg-tint"
												>
													<LuTrash2 size={16} aria-hidden="true" />
												</IconButton>
											</div>
											<div className="flex flex-wrap items-center justify-between gap-2">
												<ValueStepper
													label={shoppingText.row.boxes}
													value={item.boxes}
													min={1}
													max={Number.MAX_SAFE_INTEGER}
													display={text.boxes(item.boxes)}
													onChange={(boxes) => setBoxes(key, boxes)}
												/>
												<span className="text-muted text-xs">
													{shopName(item.store)}
												</span>
											</div>
										</li>
									);
								})}
							</ul>
							<p className="text-muted text-xs">{text.merges}</p>
						</>
					)}
				</section>
			</div>
		</Dialog>
	);
}

interface AddProductsDialogProps extends DialogContentProps {
	open: boolean;
}

export function AddProductsDialog({ open, ...props }: AddProductsDialogProps) {
	return open ? <AddProductsContent {...props} /> : null;
}
