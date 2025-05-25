import "../styles/index.css";

export default function Home() {
	return (
		<section className="w-full h-full flex flex-col justify-center items-center">
			<h1 className="text-3xl font-black text-nowrap">
				Train <span className="text-primary">Smarter</span> Not Harder
			</h1>
			<p className="text-nowrap">Backed by Science, Driven by data</p>
		</section>
	);
}
