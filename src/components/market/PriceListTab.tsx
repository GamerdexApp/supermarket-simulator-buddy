import { formatMoney } from "@/lib/format";
import { Card } from "@/comps/ui/Card";
import { Note } from "@/comps/ui/Note";
import { ItemImage } from "./ItemImage";

interface PriceListTabProps {
	heading: string;
	note: string;
	items: { name: string; unitPrice: number; imageUrl: string }[];
}

/** Furniture and paint: prices from the game data with nothing to own or save. */
export function PriceListTab({ heading, note, items }: PriceListTabProps) {
	return (
		<div className="flex flex-col gap-4">
			<Card className="flex flex-col gap-1 p-4">
				<h2 className="text-xl font-semibold">{heading}</h2>
				<p className="text-muted">{note}</p>
			</Card>
			<div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
				{items.map((item) => (
					<Card key={item.name} className="flex items-center gap-3 p-3">
						<ItemImage src={item.imageUrl} />
						<div className="flex min-w-0 flex-col">
							<span className="font-semibold">{item.name}</span>
							<span className="text-primary font-mono font-medium">
								{formatMoney(item.unitPrice)}
							</span>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
