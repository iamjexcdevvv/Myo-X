import React, { useEffect, useRef, useState } from "react";
import { WorkoutSessionLog } from "../../../types/WorkoutSessionLogType";
import useUserWorkoutSession from "../../../hooks/useUserWorkoutSession";
import { saveActiveWorkoutSession } from "../../../utils/workoutSessionUtils";
import { Trash } from "lucide-react";

export default function ExerciseSets({
	exercise,
	index,
	handleRemoveSetClick,
	setToggleRestTimer,
	setRestTimeLeft,
}: {
	exercise: WorkoutSessionLog;
	index: number;
	handleRemoveSetClick: (exerciseId: string, setId: number) => void;
	setToggleRestTimer: React.Dispatch<React.SetStateAction<boolean>>;
	setRestTimeLeft: React.Dispatch<React.SetStateAction<number>>;
}) {
	const { userExercises, setUserExercises, workoutDuration } =
		useUserWorkoutSession();

	const updateSets = useRef(false);

	const [exerciseSet, setExerciseSet] = useState<{
		reps: string;
		load: string;
		rir: string;
	}>({
		reps: exercise.sets[index].reps
			? exercise.sets[index].reps.toString()
			: "",
		load: exercise.sets[index].load
			? exercise.sets[index].load.toString()
			: "",
		rir: exercise.sets[index].rir
			? exercise.sets[index].rir.toString()
			: "",
	});

	const handleFinishSetChange = (
		exercise: WorkoutSessionLog,
		setId: number
	) => {
		const updatedExerciseSets = exercise.sets.map((set) => {
			if (set.set === setId) {
				set.finished = !set.finished;

				if (set.finished) {
					if (exercise.restTimer) {
						setRestTimeLeft(exercise.restTimer);
						setToggleRestTimer(true);
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
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleFinishSetChange(exercise, exercise.sets[index].set);

		const updatedUserWorkoutSession = userExercises.map((ex) => {
			if (ex.exerciseId !== exercise.exerciseId) return ex;

			return {
				...ex,
				sets: ex.sets.map((set) => {
					if (set.set === exercise.sets[index].set) {
						set.set = exercise.sets[index].set;
						set.reps = parseInt(exerciseSet.reps);
						set.load = parseInt(exerciseSet.load);
						set.rir = parseInt(exerciseSet.rir);
					}

					return set;
				}),
			};
		});

		setUserExercises(updatedUserWorkoutSession);
		saveActiveWorkoutSession({
			duration: workoutDuration,
			exercises: updatedUserWorkoutSession,
		});
	};

	useEffect(() => {
		if (updateSets.current) {
			setExerciseSet({
				reps: exercise.sets[index].reps
					? exercise.sets[index].reps.toString()
					: "",
				load: exercise.sets[index].load
					? exercise.sets[index].load.toString()
					: "",
				rir: exercise.sets[index].rir
					? exercise.sets[index].rir.toString()
					: "",
			});
			updateSets.current = false;
		}
	}, [exercise, index]);

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

				<div className="flex justify-center items-center space-x-5">
					<div>
						<button
							type="submit"
							className={`${
								exercise.sets[index].finished
									? "text-success"
									: ""
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

					<div>
						<button
							type="button"
							onClick={() => {
								handleRemoveSetClick(
									exercise.exerciseId,
									exercise.sets[index].set
								);
								updateSets.current = true;
							}}
						>
							<Trash className="text-error" />
						</button>
					</div>
				</div>
			</div>
		</form>
	);
}
