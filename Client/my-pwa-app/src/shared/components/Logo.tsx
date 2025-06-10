import { Link } from "react-router";

export default function Logo() {
	return (
		<Link to="/">
			<div className="flex items-center space-x-2">
				<img className="w-10 h-10" src="/myo-x.svg" alt="myo-x" />
				<h1 className="text-2xl font-black">Myo X</h1>
			</div>
		</Link>
	);
}
