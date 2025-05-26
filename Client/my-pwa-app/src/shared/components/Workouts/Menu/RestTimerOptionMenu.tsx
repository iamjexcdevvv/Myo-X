import { useState } from "react";
import { formatTime } from "../../../../utils/utils";
import { WorkoutSessionLog } from "../../../../types/WorkoutSessionLogType";
import useUserWorkoutSession from "../../../../hooks/useUserWorkoutSession";

const restTimers: number[] = [];

for (let s = 0; s <= 300; s += 5) {
	restTimers.push(s);
}

export default function RestTimerOptionMenu({
	exercise,
	setToggleMenu,
}: {
	exercise: WorkoutSessionLog;
	setToggleMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const { userExercises, setUserExercises } = useUserWorkoutSession();
	const [currentSelectedRestTime, setCurrentSelectedRestTime] = useState(0);

	const handleUpdateRestTimeClick = () => {
		const updatedUserExercises = userExercises.map((ex) => {
			if (ex.exerciseId === exercise.exerciseId) {
				return {
					...ex,
					restTimer: currentSelectedRestTime,
				};
			}

			return ex;
		});

		setUserExercises(updatedUserExercises);
		setToggleMenu((prev) => !prev);
	};

	return (
		<div className="space-y-2">
			<ul className="flex flex-col items-center space-y-2">
				{restTimers.map((restTime) => (
					<li
						className={`${
							currentSelectedRestTime === restTime
								? "bg-neutral"
								: ""
						} w-full text-center transition-all duration-150`}
						onClick={() => {
							setCurrentSelectedRestTime(restTime);
						}}
						key={restTime}
					>
						<a>{formatTime(restTime)}</a>
					</li>
				))}
			</ul>

			<div>
				<button
					onClick={handleUpdateRestTimeClick}
					className="btn w-full"
				>
					Done
				</button>
			</div>
		</div>
	);
}
