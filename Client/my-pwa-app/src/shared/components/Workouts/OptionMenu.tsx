interface OptionMenuProps extends React.PropsWithChildren {
	toggleMenu: boolean; // <-- your extra prop
}

export default function OptionMenu({ children, toggleMenu }: OptionMenuProps) {
	return (
		<div
			className={`fixed bottom-0 p-4 left-1/2 translate-x-[-50%] z-50 ${
				!toggleMenu ? "translate-y-full" : ""
			} rounded-tr-2xl rounded-tl-2xl w-60 h-40 bg-base-300 transition-all duration-300 overflow-auto`}
		>
			{children}
		</div>
	);
}
