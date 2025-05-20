import React, { useEffect, useRef, useState } from "react";
import { SaveWorkoutSessionLog } from "../../../services/LogWorkoutSessionService";
import { queueWorkoutSession } from "../../../utils/offlineSync";
import ExerciseSelection from "./ExerciseSelection";
import UserExercises from "./UserExercises";
import RestTimer from "./RestTimer";
import { formatToMMSS } from "../../../utils/utils";
import useUserExercises from "../../../hooks/useUserExercises";
import useNotification from "../../../hooks/useNotification";
import { SyncAction } from "../../../types/SyncActionType";

export default function NewWorkout({
	startWorkoutSession,
	setStartWorkoutSession,
	queuedWorkoutSessions,
	setQueuedWorkoutSessions,
}: {
	startWorkoutSession: boolean;
	setStartWorkoutSession: React.Dispatch<React.SetStateAction<boolean>>;
	queuedWorkoutSessions: SyncAction[];
	setQueuedWorkoutSessions: React.Dispatch<
		React.SetStateAction<SyncAction[]>
	>;
}) {
	const {
		userExercises,
		setUserExercises,
		workoutSessionLog,
		setWorkoutSessionLog,
	} = useUserExercises();

	const { addNotification } = useNotification();

	const [totalDuration, setTotalDuration] = useState(0);
	const duration = useRef<NodeJS.Timeout | null>(null);

	async function handleFinishWorkoutSessionClick() {
		if (startWorkoutSession && duration.current !== null) {
			setUserExercises([]);
			setStartWorkoutSession(false);
			clearInterval(duration.current);
			addNotification({
				type: "success",
				message: "Your workout session has been finished",
			});

			if (workoutSessionLog.length > 0) {
				const isSaved = await SaveWorkoutSessionLog(workoutSessionLog);

				setWorkoutSessionLog([]);

				if (!isSaved) {
					addNotification({
						type: "error",
						message: "Failed to save workout session",
					});
					queueWorkoutSession(workoutSessionLog);
					setQueuedWorkoutSessions([
						...queuedWorkoutSessions,
						{
							action: "saveWorkoutSession",
							payload: workoutSessionLog,
						},
					]);
					return;
				}

				addNotification({
					type: "success",
					message: "Workout session saved successfully",
				});
			}
		}

		// clearUserActiveWorkoutSession();
	}

	useEffect(() => {
		if (duration.current !== null) return;

		if (startWorkoutSession) {
			duration.current = setInterval(() => {
				setTotalDuration((prev) => prev + 1);
			}, 1000);
		}

		return () => clearInterval(duration.current!);
	}, [startWorkoutSession]);

	return (
		<div className="h-full w-full">
			<h1 className="text-2xl">New Workout</h1>

			<div className="space-x-2">
				<label htmlFor="exercise-selection" className="btn">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 4.5v15m7.5-7.5h-15"
						/>
					</svg>
					Add Exercise
				</label>

				<button
					onClick={handleFinishWorkoutSessionClick}
					className="btn btn-primary"
				>
					Finish
				</button>
			</div>

			<ExerciseSelection
				userExercises={userExercises}
				setUserExercises={setUserExercises}
			/>

			{userExercises.length > 0 &&
				userExercises.map((exercise) => {
					return (
						<UserExercises
							key={exercise.exerciseId}
							exercise={exercise}
						/>
					);
				})}

			<RestTimer />

			<div className="fixed top-10 left-1/2 -translate-x-1/2">
				<span>{`Duration: ${formatToMMSS(totalDuration)}`}</span>
			</div>
		</div>
	);
}
