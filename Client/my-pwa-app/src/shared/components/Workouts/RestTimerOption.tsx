// import { useState } from "react";
// import UserExerciseData from "../../../types/WorkoutSessionLogType";
// import { formatTime } from "../../../utils/utils";
// // import { saveUserExercises } from "../../utils/offlineExercise";

// export default function RestTimerOption({
// 	userExercises,
// 	selectedExercise,
// 	setSelectedExercise,
// 	setUserExercises,
// 	setToggleMenu,
// }: {
// 	userExercises: UserExerciseData[];
// 	selectedExercise: {
// 		exerciseId: string;
// 		exerciseName: string;
// 		restTimer?: number | null;
// 	};
// 	setSelectedExercise: React.Dispatch<
// 		React.SetStateAction<{
// 			exerciseId: string;
// 			exerciseName: string;
// 			restTimer?: number | null;
// 		}>
// 	>;
// 	setUserExercises: React.Dispatch<React.SetStateAction<UserExerciseData[]>>;
// 	setToggleMenu: React.Dispatch<React.SetStateAction<boolean>>;
// }) {
// 	const [currentSelectedRestTime, setCurrentSelectedRestTime] = useState<
// 		number | null
// 	>(null);

// 	const restTimers = [];

// 	for (let s = 0; s <= 300; s += 5) {
// 		restTimers.push(s);
// 	}

// 	function handleUpdateRestTimeClick() {
// 		const updatedUserExercises = userExercises.map((exercise) => {
// 			if (exercise.exerciseId === selectedExercise.exerciseId) {
// 				exercise.restTimer = currentSelectedRestTime;
// 			}

// 			return exercise;
// 		});

// 		setSelectedExercise({
// 			exerciseId: "",
// 			exerciseName: "",
// 			restTimer: null,
// 		});
// 		setUserExercises(updatedUserExercises);
// 		// saveUserExercises(updatedUserExercises);
// 		setToggleMenu(false);
// 		setCurrentSelectedRestTime(null);
// 	}

// 	return (
// 		<div className="space-y-2">
// 			<ul className="flex flex-col items-center space-y-2">
// 				{restTimers.map((restTime) => (
// 					<li
// 						className={`${
// 							currentSelectedRestTime === restTime
// 								? "bg-neutral"
// 								: ""
// 						} w-full text-center transition-all duration-150`}
// 						onClick={() => {
// 							setCurrentSelectedRestTime(restTime);
// 						}}
// 						key={restTime}
// 					>
// 						<a>{formatTime(restTime)}</a>
// 					</li>
// 				))}
// 			</ul>

// 			<div>
// 				<button
// 					onClick={handleUpdateRestTimeClick}
// 					className="btn w-full"
// 				>
// 					Done
// 				</button>
// 			</div>
// 		</div>
// 	);
// }
