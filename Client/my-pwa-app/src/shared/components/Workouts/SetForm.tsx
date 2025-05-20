import { useState } from "react";
// import { saveUserExercises } from "../../utils/offlineExercise";
import { saveActiveWorkoutSession } from "../../../utils/offlineExercise";
import { WorkoutSessionLog } from "../../../types/WorkoutSessionLogType";
import useUserExercises from "../../../hooks/useUserExercises";

export default function SetForm({
	exercise,
	index,
}: {
	exercise: WorkoutSessionLog;
	index: number;
}) {
	const [exerciseSet, setExerciseSet] = useState<{
		reps: string;
		load: string;
		rir: string;
	}>({
		reps: "",
		load: "",
		rir: "",
	});

	const {
		userExercises,
		setUserExercises,
		clearRestTimer,
		setupRestTimer,
		currentActiveSetId,
		currentActiveExerciseId,
		workoutSessionLog,
		setWorkoutSessionLog,
	} = useUserExercises();

	function handleFinishSetChange(exercise: WorkoutSessionLog, setId: number) {
		const updatedExerciseSets = exercise.sets.map((set) => {
			if (set.set === setId) {
				if (set.finished) {
					set.finished = false;
					if (
						currentActiveSetId === setId &&
						currentActiveExerciseId === exercise.exerciseId
					) {
						clearRestTimer();
					}
				} else {
					set.finished = true;

					if (exercise.restTimer !== null) {
						setupRestTimer(exercise, setId);
					}
				}
			}
			return set;
		});

		const updatedUserExercises = userExercises.map((ex) => {
			if (ex.exerciseId === exercise.exerciseId) {
				return {
					...ex,
					sets: updatedExerciseSets,
				};
			}
			return ex;
		});

		setUserExercises(updatedUserExercises);
		saveActiveWorkoutSession({ exercises: updatedUserExercises });
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		handleFinishSetChange(exercise, exercise.sets[index].set);

		const exerciseLog = workoutSessionLog.map((ex) => {
			if (ex.exerciseId === exercise.exerciseId) {
				return {
					...ex,
					sets: [
						...ex.sets,
						{
							set: exercise.sets[index].set,
							reps: parseInt(exerciseSet.reps, 10),
							load: parseInt(exerciseSet.load, 10),
							rir: parseInt(exerciseSet.rir, 10),
						},
					],
				};
			}

			return ex;
		});

		console.log(exerciseLog);

		setWorkoutSessionLog(exerciseLog);
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className="grid grid-cols-4 gap-4">
				<div>
					<input
						type="number"
						value={exerciseSet.reps}
						onChange={(e) =>
							setExerciseSet({
								...exerciseSet,
								reps: e.target.value,
							})
						}
						className="input"
						required
						min="1"
					/>
				</div>

				<div>
					<input
						type="number"
						value={exerciseSet.load}
						onChange={(e) =>
							setExerciseSet({
								...exerciseSet,
								load: e.target.value,
							})
						}
						className="input"
						required
						min="1"
					/>
				</div>

				<div>
					<input
						type="number"
						value={exerciseSet.rir}
						onChange={(e) =>
							setExerciseSet({
								...exerciseSet,
								rir: e.target.value,
							})
						}
						className="input"
						required
						min="1"
					/>
				</div>

				<div className="flex items-center justify-center">
					<button
						type="submit"
						className={`${
							exercise.sets[index].finished ? "text-success" : ""
						}`}
					>
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
								d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
							/>
						</svg>
					</button>
				</div>
			</div>
		</form>
	);
}
