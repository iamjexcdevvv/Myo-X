import { Plus } from "lucide-react";
import ExerciseSelection from "./ExerciseSelection";
import UserExercises from "./UserExercises";
import useUserWorkoutSession from "../../../hooks/useUserWorkoutSession";
import React, { useEffect, useRef, useState } from "react";
import { formatToMMSS } from "../../../utils/utils";
// import { ActiveWorkoutSession } from "../../../types/ActiveWorkoutSessionType";
import { saveActiveWorkoutSession } from "../../../utils/workoutSessionUtils";
import useNotification from "../../../hooks/useNotification";
import { SaveWorkoutSessionLog } from "../../../services/LogWorkoutSessionService";
import { queueWorkoutSession } from "../../../utils/syncUtils";
import RestTimer from "./RestTimer";
import { ActiveWorkoutSession } from "../../../types/ActiveWorkoutSessionType";
import { WorkoutSessionLog } from "../../../types/WorkoutSessionLogType";

export default function NewWorkout({
	isNewWorkoutStarted,
	setIsNewWorkoutStarted,
	setQueuedWorkoutSessionsCount,
	lastActiveWorkoutSessionLogRef,
	clearLastActiveWorkoutSessionLog,
}: {
	isNewWorkoutStarted: boolean;
	setIsNewWorkoutStarted: React.Dispatch<React.SetStateAction<boolean>>;
	setQueuedWorkoutSessionsCount: React.Dispatch<React.SetStateAction<number>>;
	lastActiveWorkoutSessionLogRef: ActiveWorkoutSession | null;
	clearLastActiveWorkoutSessionLog: () => void;
}) {
	const { addNotification } = useNotification();
	const {
		userExercises,
		setUserExercises,
		setWorkoutDuration,
		workoutDuration,
	} = useUserWorkoutSession();

	const latestExercisesRef = useRef<WorkoutSessionLog[] | null>(
		userExercises
	);
	const workoutDurationRef = useRef<number | null>(0);

	const [toggleRestTimer, setToggleRestTimer] = useState(false);
	const [restTimeLeft, setRestTimeLeft] = useState(0);

	const restTimerInterval = useRef<ReturnType<typeof setInterval> | null>(
		null
	);

	const handleAddSetClick = (exerciseId: string) => {
		const updatedUserExercises = userExercises.map((ex) => {
			if (ex.exerciseId === exerciseId) {
				return {
					...ex,
					sets: [
						...ex.sets,
						{ set: ex.sets.length + 1, finished: false },
					],
				};
			}

			return ex;
		});

		setUserExercises(updatedUserExercises);
		saveActiveWorkoutSession({
			duration: workoutDuration,
			exercises: updatedUserExercises,
		});
	};

	const handleRemoveSetClick = (exerciseId: string, setId: number) => {
		const filteredUserExercises = userExercises.map((ex) => {
			if (ex.exerciseId === exerciseId) {
				return {
					...ex,
					sets: ex.sets.filter((set) => set.set !== setId),
				};
			}

			return ex;
		});

		const updatedUserExercises = filteredUserExercises.map((ex) => {
			if (ex.exerciseId === exerciseId) {
				return {
					...ex,
					sets: ex.sets.map((set, index) => {
						return {
							...set,
							set: index + 1,
						};
					}),
				};
			}

			return ex;
		});

		setUserExercises(updatedUserExercises);
		saveActiveWorkoutSession({
			duration: workoutDuration,
			exercises: updatedUserExercises,
		});
	};

	const handleFinishWorkoutClick = async () => {
		latestExercisesRef.current = null;
		workoutDurationRef.current = null;

		clearLastActiveWorkoutSessionLog();
		setIsNewWorkoutStarted(false);
		setWorkoutDuration(0);

		addNotification({
			type: "success",
			message: "Workout session has been finished",
		});

		if (userExercises.length > 0) {
			const success = await SaveWorkoutSessionLog({
				exercises: userExercises,
			});

			if (!success) {
				queueWorkoutSession(userExercises);
				setQueuedWorkoutSessionsCount((prev) => prev + 1);

				addNotification({
					type: "error",
					message: "Failed to save workout session",
				});
				return;
			}

			addNotification({
				type: "success",
				message: "Workout session has been saved succesfully",
			});

			setUserExercises([]);
		}
	};

	useEffect(() => {
		return () => {
			setWorkoutDuration(0);
		};
	}, [setWorkoutDuration]);

	useEffect(() => {
		if (lastActiveWorkoutSessionLogRef?.duration) {
			setWorkoutDuration(lastActiveWorkoutSessionLogRef.duration);
			workoutDurationRef.current =
				lastActiveWorkoutSessionLogRef.duration;
		}
	}, [lastActiveWorkoutSessionLogRef, setWorkoutDuration]);

	useEffect(() => {
		return () => {
			if (latestExercisesRef.current || workoutDurationRef.current) {
				saveActiveWorkoutSession({
					duration: workoutDurationRef.current || 0,
					exercises: latestExercisesRef.current || [],
				});
			}
		};
	}, []);

	useEffect(() => {
		latestExercisesRef.current = userExercises;
	}, [userExercises]);

	useEffect(() => {
		let interval: ReturnType<typeof setInterval> | null = null;

		if (isNewWorkoutStarted && interval === null) {
			interval = setInterval(() => {
				setWorkoutDuration((prev) => {
					const next = prev + 1;
					workoutDurationRef.current = next;
					return next;
				});
			}, 1000);
		}

		return () => {
			if (interval !== null) clearInterval(interval);
		};
	}, [isNewWorkoutStarted, setWorkoutDuration]);

	useEffect(() => {
		if (toggleRestTimer) {
			if (restTimerInterval.current)
				clearInterval(restTimerInterval.current);

			restTimerInterval.current = setInterval(() => {
				setRestTimeLeft((prev) => {
					if (prev <= 0) {
						setToggleRestTimer(false);

						if (restTimerInterval.current)
							clearInterval(restTimerInterval.current);

						return 0;
					}

					return prev - 1;
				});
			}, 1000);
		}

		return () => {
			if (restTimerInterval.current !== null)
				clearInterval(restTimerInterval.current);
		};
	}, [toggleRestTimer]);

	return (
		<div className="space-y-2">
			<h1 className="text-2xl">New Workout</h1>

			<div className="flex space-x-3">
				<div>
					<label htmlFor="exercise-selection-modal" className="btn">
						<Plus />
						<span>Add Exercise</span>
					</label>
				</div>

				<div>
					<button
						onClick={handleFinishWorkoutClick}
						className="btn btn-primary"
					>
						Finish Workout
					</button>
				</div>
			</div>

			<ExerciseSelection />

			{userExercises.length > 0 && (
				<div className="space-y-3">
					{userExercises.map((exercise) => {
						return (
							<UserExercises
								key={exercise.exerciseId}
								exercise={exercise}
								handleAddSetClick={handleAddSetClick}
								handleRemoveSetClick={handleRemoveSetClick}
								setToggleRestTimer={setToggleRestTimer}
								setRestTimeLeft={setRestTimeLeft}
							/>
						);
					})}
				</div>
			)}

			{isNewWorkoutStarted && (
				<div className="fixed top-3 left-1/2 -translate-x-1/2">
					<span>{`Duration: ${formatToMMSS(workoutDuration)}`}</span>
				</div>
			)}

			{toggleRestTimer && (
				<RestTimer
					restTimeLeft={restTimeLeft}
					setToggleRestTimer={setToggleRestTimer}
					restTimerInterval={restTimerInterval}
					setRestTimeLeft={setRestTimeLeft}
				/>
			)}
		</div>
	);
}
