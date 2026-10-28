import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { APP_NAME, HOME_HREF } from "@/data/nav";

const BRAND_WORD_KEYS = ["item1", "item2", "item3"] as const;

export function BrandMark({ onNavigate }: { onNavigate?: () => void }) {
	const t = useTranslations("shell.brandWords");
	return (
		<Link href={HOME_HREF} onClick={onNavigate} className="flex min-h-11 items-center gap-2.5">
			<Image
				src="/logo.jpg"
				alt=""
				width={36}
				height={36}
				className="block size-9 shrink-0 rounded-md"
			/>
			<span aria-hidden="true" className="flex flex-col">
				{BRAND_WORD_KEYS.map((key) => (
					<span
						key={key}
						className="font-brand text-sb-text text-[13px] leading-[1.05] font-extrabold italic"
					>
						{t(key)}
					</span>
				))}
			</span>
			<span className="sr-only">{APP_NAME}</span>
		</Link>
	);
}
