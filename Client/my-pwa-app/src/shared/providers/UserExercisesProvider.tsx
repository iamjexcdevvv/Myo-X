// import { useEffect, useRef, useState } from "react";
// import { UserExercisesContext } from "../../context/UserExercisesContext";
// import UserExerciseData, {
// 	WorkoutSessionLog,
// } from "../../types/WorkoutSessionLogType";

// export default function UserExercisesProvider({
// 	children,
// }: React.PropsWithChildren) {
// 	const [userExercises, setUserExercises] = useState<UserExerciseData[]>([]);

// 	const [currentActiveExerciseId, setCurrentActiveExerciseId] = useState<
// 		string | null
// 	>(null);
// 	const [currentActiveSetId, setCurrentActiveSetId] = useState<number | null>(
// 		null
// 	);
// 	const [toggleSetTimer, setToggleSetTimer] = useState(false);
// 	const [restTimeLeft, setRestTimeLeft] = useState<number | null>(null);

// 	const [workoutSessionLog, setWorkoutSessionLog] = useState<
// 		WorkoutSessionLog[]
// 	>([]);

// 	const timer = useRef<ReturnType<typeof setInterval> | null>(null);

// 	function setupRestTimer(exercise: UserExerciseData, setId: number) {
// 		setCurrentActiveSetId(setId);
// 		setCurrentActiveExerciseId(exercise.exerciseId);
// 		setToggleSetTimer(true);
// 		setRestTimeLeft(exercise.restTimer);
// 		clearInterval(timer.current!);
// 	}

// 	function clearRestTimer() {
// 		setCurrentActiveSetId(null);
// 		setCurrentActiveExerciseId(null);
// 		setToggleSetTimer(false);
// 		setRestTimeLeft(null);
// 		clearInterval(timer.current!);
// 	}

// 	useEffect(() => {
// 		if (currentActiveExerciseId !== null && currentActiveSetId !== null) {
// 			clearInterval(timer.current!);
// 			timer.current = setInterval(() => {
// 				setRestTimeLeft((prev) => {
// 					if (prev! <= 0) {
// 						clearInterval(timer.current!);
// 						setRestTimeLeft(null);
// 						setCurrentActiveSetId(null);
// 						setCurrentActiveExerciseId(null);
// 						setToggleSetTimer(false);
// 						return 0;
// 					}
// 					return prev! - 1;
// 				});
// 			}, 1000);
// 		}

// 		return () => clearInterval(timer.current!);
// 	}, [currentActiveExerciseId, currentActiveSetId]);

// 	return (
// 		<UserExercisesContext.Provider
// 			value={{
// 				userExercises,
// 				setUserExercises,
// 				clearRestTimer,
// 				restTimeLeft,
// 				setupRestTimer,
// 				currentActiveExerciseId,
// 				currentActiveSetId,
// 				toggleSetTimer,
// 				workoutSessionLog,
// 				setWorkoutSessionLog,
// 			}}
// 		>
// 			{children}
// 		</UserExercisesContext.Provider>
// 	);
// }
