import { LuLock } from "react-icons/lu";

/** A locked item always says why in text, never by color alone. */
export function LockReason({ reasons }: { reasons: string[] }) {
	return (
		<p className="text-locked flex items-start gap-1.5">
			<LuLock size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
			<span className="flex flex-col">
				{reasons.map((reason) => (
					<span key={reason}>{reason}</span>
				))}
			</span>
		</p>
	);
}
