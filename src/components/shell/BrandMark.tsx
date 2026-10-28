import Image from "next/image";
import Link from "next/link";
import { shellText } from "@/lib/messages/shell";
import { APP_NAME, HOME_HREF } from "@/data/nav";

export function BrandMark({ onNavigate }: { onNavigate?: () => void }) {
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
				{shellText.brandWords.map((word) => (
					<span
						key={word}
						className="font-brand text-sb-text text-[13px] leading-[1.05] font-extrabold italic"
					>
						{word}
					</span>
				))}
			</span>
			<span className="sr-only">{APP_NAME}</span>
		</Link>
	);
}
