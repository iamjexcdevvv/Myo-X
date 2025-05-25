import { Plus } from "lucide-react";
import ExerciseSelection from "./ExerciseSelection";
import UserExercises from "./UserExercises";
import useUserExercises from "../../../hooks/useUserWorkoutSession";
import { useEffect, useRef } from "react";
import { formatToMMSS } from "../../../utils/utils";
import { ActiveWorkoutSession } from "../../../types/ActiveWorkoutSessionType";
import {
	clearLastActiveWorkoutSession,
	saveActiveWorkoutSession,
} from "../../../utils/workoutSessionUtils";
import useNotification from "../../../hooks/useNotification";
import { SaveWorkoutSessionLog } from "../../../services/LogWorkoutSessionService";
import { queueWorkoutSession } from "../../../utils/syncUtils";

export default function NewWorkout({
	isNewWorkoutStarted,
	lastActiveWorkoutSessionLogRef,
	setIsNewWorkoutStarted,
	setQueuedWorkoutSessionsCount,
}: {
	isNewWorkoutStarted: boolean;
	lastActiveWorkoutSessionLogRef: ActiveWorkoutSession | null;
	setIsNewWorkoutStarted: React.Dispatch<React.SetStateAction<boolean>>;
	setQueuedWorkoutSessionsCount: React.Dispatch<React.SetStateAction<number>>;
}) {
	const { addNotification } = useNotification();
	const {
		userExercises,
		setUserExercises,
		setWorkoutDuration,
		workoutDuration,
	} = useUserExercises();

	const latestExercisesRef = useRef(userExercises);
	const workoutDurationRef = useRef(0);

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
		clearLastActiveWorkoutSession();
		setIsNewWorkoutStarted(false);
		setWorkoutDuration(0);
		workoutDurationRef.current = 0;
		latestExercisesRef.current = [];

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
					duration: workoutDurationRef.current,
					exercises: latestExercisesRef.current,
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
							/>
						);
					})}
				</div>
			)}

			{isNewWorkoutStarted && (
				<div className="fixed top-12 left-1/2 -translate-x-1/2">
					<span>{`Duration: ${formatToMMSS(workoutDuration)}`}</span>
				</div>
			)}
		</div>
	);
}
