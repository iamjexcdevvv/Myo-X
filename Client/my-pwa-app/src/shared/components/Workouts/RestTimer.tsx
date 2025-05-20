import useUserExercises from "../../../hooks/useUserExercises";
import { formatToMMSS } from "../../../utils/utils";

export default function RestTimer() {
	const { clearRestTimer, restTimeLeft, toggleSetTimer } = useUserExercises();

	return (
		toggleSetTimer &&
		restTimeLeft !== null && (
			<div className="fixed bg-base-300 rounded-2xl w-1/2 h-20 bottom-5 z-40 left-1/2 translate-x-[-50%]">
				<div className="flex w-full h-full justify-around items-center">
					<div>
						<span>{formatToMMSS(restTimeLeft)}</span>
					</div>
					<div>
						<button
							onClick={() => clearRestTimer()}
							className="btn btn-primary"
						>
							Skip
						</button>
					</div>
				</div>
			</div>
		)
	);
}
