import { formatToMMSS } from "../../../utils/utils";

export default function RestTimer({
	restTimeLeft,
	setRestTimeLeft,
	setToggleRestTimer,
	restTimerInterval,
}: {
	restTimeLeft: number;
	setRestTimeLeft: React.Dispatch<React.SetStateAction<number>>;
	setToggleRestTimer: React.Dispatch<React.SetStateAction<boolean>>;
	restTimerInterval: React.RefObject<ReturnType<typeof setInterval> | null>;
}) {
	return (
		<div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-base-300 w-64 h-24 rounded-2xl">
			<div className="flex items-center justify-center w-full h-full space-x-14">
				<div className="flex space-x-3">
					<div>
						<button
							className="text-primary"
							onClick={() => setRestTimeLeft((prev) => prev - 15)}
						>
							-15
						</button>
					</div>
					<div>
						<span>{formatToMMSS(restTimeLeft)}</span>
					</div>
					<div>
						<button
							className="text-primary"
							onClick={() => setRestTimeLeft((prev) => prev + 15)}
						>
							+15
						</button>
					</div>
				</div>

				<div>
					<button
						onClick={() => {
							setToggleRestTimer(false);
							if (restTimerInterval.current)
								clearInterval(restTimerInterval.current);
						}}
						className="btn btn-primary"
					>
						Skip
					</button>
				</div>
			</div>
		</div>
	);
}
