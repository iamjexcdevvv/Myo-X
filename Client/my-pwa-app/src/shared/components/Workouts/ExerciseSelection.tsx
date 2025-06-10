import { useEffect, useState } from "react";
import { filterExercisesByName } from "../../../utils/offlineExercisesUtils";
import { ExerciseData } from "../../../types/ExerciseDataType";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkoutSessionLog } from "../../../types/WorkoutSessionLogType";
import useNotification from "../../../hooks/useNotification";
import useUserExercises from "../../../hooks/useUserWorkoutSession";
import { saveActiveWorkoutSession } from "../../../utils/workoutSessionUtils";

const exerciseSelectionSchema = z
	.object({
		sets: z
			.number({
				required_error: "Sets is required",
			})
			.min(1, "The exercise requires at least one exercise"),
		repStart: z
			.number({
				required_error: "Rep range is required",
			})
			.min(1, "The exercise requires at least one rep start"),
		repEnd: z
			.number({
				required_error: "Rep range is required",
			})
			.min(1, "The exercise requires at least one rep end"),
	})
	.refine((val) => val.repEnd > val.repStart, {
		path: ["repEnd"],
		message: "Invalid rep range",
	});

type ExerciseSelectionType = z.infer<typeof exerciseSelectionSchema>;

export default function ExerciseSelection() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ExerciseSelectionType>({
		resolver: zodResolver(exerciseSelectionSchema),
	});

	const { setUserExercises, userExercises, workoutDuration } =
		useUserExercises();
	const { addNotification } = useNotification();

	const [currentSelectedExercises, setCurrentSelectedExercises] = useState<
		WorkoutSessionLog[]
	>([]);

	const [selectedExercise, setSelectedExercise] = useState<{
		exerciseName: string;
		exerciseId: string;
	}>({ exerciseName: "", exerciseId: "" });

	const [filteredExercises, setFilteredExercises] = useState<ExerciseData[]>(
		[]
	);

	const [searchQuery, setSearchQuery] = useState<string>("");

	const onSubmit = (data: ExerciseSelectionType) => {
		if (!selectedExercise.exerciseId || !selectedExercise.exerciseName)
			return addNotification({
				type: "error",
				message: "Please select at least one exercise",
			});

		const exerciseSets = [];

		for (let i = 0; i < data.sets; i++) {
			exerciseSets.push({
				set: i + 1,
				finished: false,
			});
		}

		setCurrentSelectedExercises([
			...currentSelectedExercises,
			{
				exerciseId: selectedExercise.exerciseId,
				exerciseName: selectedExercise.exerciseName,
				repRangeStart: data.repStart,
				repRangeEnd: data.repEnd,
				sets: exerciseSets,
				restTimer: null,
			},
		]);

		reset();
		setSelectedExercise({ exerciseId: "", exerciseName: "" });
	};

	const handleSelectExerciseClick = (exercise: ExerciseData) => {
		setSelectedExercise({
			exerciseId: exercise.id,
			exerciseName: exercise.name,
		});
		setFilteredExercises([]);
	};

	const handleRemoveSelectedExerciseClick = (exerciseId: string) => {
		const filteredSelectedExercises = currentSelectedExercises.filter(
			(exercise) => exercise.exerciseId !== exerciseId
		);

		setCurrentSelectedExercises(filteredSelectedExercises);
	};

	const handleDisplaySelectedExercises = () => {
		if (currentSelectedExercises.length === 0) return;

		const updatedUserExercises = [
			...userExercises,
			...currentSelectedExercises,
		];

		setUserExercises(updatedUserExercises);
		saveActiveWorkoutSession({
			duration: workoutDuration,
			exercises: updatedUserExercises,
		});
		setCurrentSelectedExercises([]);

		addNotification({
			type: "success",
			message:
				"Selected exercises has been successfully added to your workout session",
		});
	};

	useEffect(() => {
		if (searchQuery === "") return setFilteredExercises([]);

		async function onSearchExercise() {
			setFilteredExercises(await filterExercisesByName(searchQuery));
		}

		const timeout = setTimeout(() => {
			onSearchExercise();
		}, 500);

		return () => clearTimeout(timeout);
	}, [searchQuery]);

	return (
		<div>
			<input
				type="checkbox"
				id="exercise-selection-modal"
				className="modal-toggle"
			/>
			<div className="modal z-40" role="dialog">
				<div className="modal-box w-full h-[450px] overflow-auto">
					<div className="space-y-3">
						<h6 className="text-xl">Exercise Selection</h6>

						<div>
							<div className="w-full">
								<label className="input w-full">
									<svg
										className="h-[1em] opacity-50"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
									>
										<g
											strokeLinejoin="round"
											strokeLinecap="round"
											strokeWidth="2.5"
											fill="none"
											stroke="currentColor"
										>
											<circle
												cx="11"
												cy="11"
												r="8"
											></circle>
											<path d="m21 21-4.3-4.3"></path>
										</g>
									</svg>
									<input
										type="search"
										value={selectedExercise.exerciseName}
										onChange={(e) => {
											setSearchQuery(e.target.value);
											setSelectedExercise({
												...selectedExercise,
												exerciseName: e.target.value,
											});
										}}
										placeholder="Search"
									/>
								</label>

								{filteredExercises.length > 0 && (
									<div className="flex flex-col bg-base-300 p-3 space-y-1 w-full h-36 overflow-auto">
										{filteredExercises.map((exercise) => {
											return (
												<span
													onClick={() => {
														handleSelectExerciseClick(
															exercise
														);
													}}
													className="text-nowrap"
													key={exercise.id}
												>
													{exercise.name}
												</span>
											);
										})}
									</div>
								)}
							</div>

							{currentSelectedExercises.length > 0 && (
								<div className="grid grid-cols-4 gap-2 mt-3">
									{currentSelectedExercises.map(
										(exercise) => {
											return (
												<div key={exercise.exerciseId}>
													<div className="relative bg-primary p-2 rounded-2xl">
														<button
															onClick={() =>
																handleRemoveSelectedExerciseClick(
																	exercise.exerciseId
																)
															}
															type="button"
															className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
														>
															×
														</button>
														<div className="overflow-auto">
															<span className="text-sm text-neutral text-nowrap">
																{
																	exercise.exerciseName
																}
															</span>
														</div>
													</div>
												</div>
											);
										}
									)}
								</div>
							)}

							<form
								onSubmit={handleSubmit(onSubmit)}
								className="grid grid-cols-1 gap-3 sm:grid-cols-2"
							>
								<div className="sm:col-span-2">
									<fieldset className="fieldset">
										<legend className="fieldset-legend">
											Sets
										</legend>
										<input
											type="number"
											className="input w-full"
											{...register("sets", {
												setValueAs: (value) =>
													value === ""
														? undefined
														: parseInt(value, 10),
											})}
										/>
									</fieldset>

									{errors.sets && (
										<span className="text-error text-xs">
											{errors.sets.message}
										</span>
									)}
								</div>

								<div>
									<fieldset className="fieldset">
										<legend className="fieldset-legend">
											Rep Range (Start)
										</legend>
										<input
											type="number"
											className="input w-full"
											{...register("repStart", {
												setValueAs: (value) =>
													value === ""
														? undefined
														: parseInt(value, 10),
											})}
										/>
									</fieldset>

									{errors.repStart && (
										<span className="text-error text-xs">
											{errors.repStart.message}
										</span>
									)}
								</div>

								<div>
									<fieldset className="fieldset">
										<legend className="fieldset-legend">
											Rep Range (End)
										</legend>
										<input
											type="number"
											className="input w-full"
											{...register("repEnd", {
												setValueAs: (value) =>
													value === ""
														? undefined
														: parseInt(value, 10),
											})}
										/>
									</fieldset>

									{errors.repEnd && (
										<span className="text-error text-xs">
											{errors.repEnd.message}
										</span>
									)}
								</div>

								<div className="modal-action">
									<label
										onClick={handleDisplaySelectedExercises}
										htmlFor="exercise-selection-modal"
										className="btn"
									>
										Close
									</label>
									<button type="submit" className="btn">
										Select Exercise
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
