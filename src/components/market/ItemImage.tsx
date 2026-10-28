/** A fixed size image slot so cards line up whether or not an item has a picture. */
export function ItemImage({ src, muted = false }: { src: string; muted?: boolean }) {
	return (
		<span
			aria-hidden="true"
			className="bg-bg flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md lg:size-14"
		>
			{src && (
				<img
					src={src}
					alt=""
					loading="lazy"
					className={`size-full object-contain ${muted ? "opacity-70 grayscale" : ""}`}
				/>
			)}
		</span>
	);
}
