import { PropsWithChildren } from "react";

export default function OptionMenu({
	children,
	toggleMenu,
}: PropsWithChildren<{ toggleMenu: boolean }>) {
	return (
		<div
			className={`fixed ${
				toggleMenu ? "bottom-0" : "-bottom-full"
			} m-0 left-1/2 overflow-auto pt-3 -translate-x-1/2 w-56 h-40 bg-base-300 rounded-tl-3xl rounded-tr-3xl transition-all duration-300 z-50`}
		>
			{children}
		</div>
	);
}
