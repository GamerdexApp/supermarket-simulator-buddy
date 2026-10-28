import { useTranslations } from "next-intl";
import { Card } from "@/comps/ui/Card";

const POINTS = ["item1", "item2", "item3", "item4", "item5"] as const;

export function HowSyncWorks() {
	const t = useTranslations("sync.how");

	return (
		<Card className="flex flex-col gap-3 p-4">
			<h2 className="text-base font-semibold">{t("title")}</h2>
			<ul className="flex flex-col gap-3">
				{POINTS.map((point) => (
					<li key={point} className="flex items-start gap-3">
						<span
							aria-hidden="true"
							className="bg-primary mt-2 size-1.5 shrink-0 rounded-full"
						/>
						<span>{t(`points.${point}`)}</span>
					</li>
				))}
			</ul>
		</Card>
	);
}
