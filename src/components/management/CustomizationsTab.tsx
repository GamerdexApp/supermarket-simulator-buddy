import { useTranslations } from "next-intl";
import { formatMoney } from "@/lib/format";
import { customizationsTotal } from "@/service/management";
import { management } from "@/data/supermarket-simulator/management";
import { Card } from "@/comps/ui/Card";
import { Note } from "@/comps/ui/Note";
import { SummaryTile } from "@/comps/ui/SummaryTile";

export function CustomizationsTab() {
	const t = useTranslations("management.customizations");
	return (
		<div className="flex flex-col gap-4">
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				<SummaryTile
					label={t("total")}
					value={formatMoney(customizationsTotal)}
					caption={t("totalCaption")}
					emphasis
				/>
			</div>
			<Note>{t("note")}</Note>
			<div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
				{management.customizations.map((customization) => (
					<Card key={customization.name} className="flex flex-col gap-2 p-4">
						<h2 className="text-lg font-semibold">{customization.name}</h2>
						<p className="text-muted">{customization.description}</p>
						<div className="bg-bg flex w-fit flex-col rounded-md px-3 py-2">
							<span className="text-muted text-xs">{t("price")}</span>
							<span className="font-mono font-medium">
								{formatMoney(customization.price)}
							</span>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
