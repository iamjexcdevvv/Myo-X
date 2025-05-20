import { useEffect, useState } from "react";
import {
	filterExercisesByName,
	populateExercises,
	saveActiveWorkoutSession,
} from "../../../utils/offlineExercise";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { WorkoutSessionLog } from "../../../types/WorkoutSessionLogType";
import useNotification from "../../../hooks/useNotification";
import useUserExercises from "../../../hooks/useUserExercises";
import { ExerciseData } from "../../../types/ExerciseDataType";

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

export default function ExerciseSelection({
	setUserExercises,
	userExercises,
}: {
	setUserExercises: React.Dispatch<React.SetStateAction<WorkoutSessionLog[]>>;
	userExercises: WorkoutSessionLog[];
}) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ExerciseSelectionType>({
		resolver: zodResolver(exerciseSelectionSchema),
	});

	const { addNotification } = useNotification();

	const { setWorkoutSessionLog, workoutSessionLog } = useUserExercises();

	const [filteredExercises, setFilteredExercises] = useState<ExerciseData[]>(
		[]
	);

	const [search, setSearch] = useState("");

	const [userSelectedExercises, setUserSelectedExercises] = useState<
		WorkoutSessionLog[]
	>([]);
	const [selectedExercise, setSelectedExercise] = useState<{
		exerciseId: string;
		exerciseName: string;
	}>({ exerciseId: "", exerciseName: "" });

	function onSubmit(data: ExerciseSelectionType) {
		if (
			selectedExercise.exerciseId === "" &&
			selectedExercise.exerciseName === ""
		) {
			addNotification({
				type: "error",
				message: "Please select at least one exercise",
			});
			return;
		}

		const exerciseSets = [];

		for (let i = 1; i <= data.sets; i++) {
			exerciseSets.push({ set: i, finished: false });
		}

		setUserSelectedExercises([
			...userSelectedExercises,
			{
				exerciseId: selectedExercise.exerciseId,
				exerciseName: selectedExercise.exerciseName,
				sets: exerciseSets,
				repRangeStart: data.repStart,
				repRangeEnd: data.repEnd,
				restTimer: null,
			},
		]);
		reset();
		setSelectedExercise({ exerciseId: "", exerciseName: "" });
	}

	function handleSelectExerciseClick(exercise: ExerciseData) {
		setSelectedExercise({
			exerciseId: exercise.exerciseId,
			exerciseName: exercise.name,
		});
		setFilteredExercises([]);
	}

	function handleRemoveSelectedExercise(exercise: {
		exerciseId: string;
		exerciseName: string;
	}) {
		const updatedUserSelectedExercises = userSelectedExercises.filter(
			(userSelectedExercise) =>
				userSelectedExercise.exerciseId !== exercise.exerciseId
		);

		setUserSelectedExercises(updatedUserSelectedExercises);
	}

	useEffect(() => {
		populateExercises();
	}, []);

	useEffect(() => {
		async function onSearchByExerciseName() {
			setFilteredExercises(await filterExercisesByName(search));
		}

		if (search.trim() === "") {
			setFilteredExercises([]);
			return;
		}

		const timeout: ReturnType<typeof setTimeout> = setTimeout(() => {
			onSearchByExerciseName();
		}, 500);

		return () => clearTimeout(timeout);
	}, [search]);

	return (
		<div>
			<input
				type="checkbox"
				id="exercise-selection"
				className="modal-toggle"
			/>
			<div className="modal z-40" role="dialog">
				<div className="modal-box max-h-[500px] overflow-auto">
					<h2 className="text-xl mb-3 text-nowrap">
						Exercise selection
					</h2>

					<div>
						<div>
							<div>
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
										className="w-full"
										type="search"
										required
										placeholder="Search"
										onChange={(e) => {
											setSearch(e.target.value);
											setSelectedExercise({
												...selectedExercise,
												exerciseName: e.target.value,
											});
										}}
										value={selectedExercise.exerciseName}
									/>
								</label>
							</div>

							<div className="space-y-4">
								{filteredExercises.length > 0 && (
									<div className="w-full h-30 bg-base-300 overflow-auto">
										<div className="flex flex-col px-4 py-2 space-y-1">
											{filteredExercises.map(
												(exercise) => {
													return (
														<span
															onClick={() => {
																handleSelectExerciseClick(
																	exercise
																);
															}}
															key={
																exercise.exerciseId
															}
														>
															{exercise.name}
														</span>
													);
												}
											)}
										</div>
									</div>
								)}

								{userSelectedExercises.length > 0 && (
									<div className="space-y-2 sm:col-span-2">
										<h6>Selected exercises:</h6>

										<div className="grid grid-cols-4 gap-2">
											{userSelectedExercises.map(
												(exercise) => {
													return (
														<div
															key={
																exercise.exerciseId
															}
															className="relative bg-primary p-2 rounded-2xl"
														>
															<button
																onClick={() => {
																	handleRemoveSelectedExercise(
																		exercise
																	);
																}}
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
													);
												}
											)}
										</div>
									</div>
								)}
							</div>
						</div>

						<form
							onSubmit={handleSubmit(onSubmit)}
							className="grid gap-2 sm:grid-cols-2"
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
									<p className="text-error text-sm">
										{errors.sets.message}
									</p>
								)}
							</div>

							<div>
								<fieldset className="fieldset">
									<legend className="fieldset-legend">
										Rep range (Start)
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
									<p className="text-error text-sm">
										{errors.repStart.message}
									</p>
								)}
							</div>

							<div>
								<fieldset className="fieldset">
									<legend className="fieldset-legend">
										Rep range (End)
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
									<p className="text-error text-sm">
										{errors.repEnd.message}
									</p>
								)}
							</div>

							<div className="modal-action flex-wrap">
								<label
									onClick={() => {
										if (userSelectedExercises.length > 0) {
											const updatedUserExercises = [
												...userExercises,
												...userSelectedExercises,
											];

											setUserExercises(
												updatedUserExercises
											);
											saveActiveWorkoutSession({
												exercises: updatedUserExercises,
											});

											const exercises: WorkoutSessionLog[] =
												userSelectedExercises.map(
													(exercise) => {
														return {
															exerciseId:
																exercise.exerciseId,
															exerciseName:
																exercise.exerciseName,
															repRangeStart:
																exercise.repRangeStart,
															repRangeEnd:
																exercise.repRangeEnd,
															sets: [],
															restTimer: null,
														};
													}
												);

											setWorkoutSessionLog([
												...workoutSessionLog,
												...exercises,
											]);
										}

										reset();
										setUserSelectedExercises([]);
										setSelectedExercise({
											exerciseId: "",
											exerciseName: "",
										});
										setFilteredExercises([]);
									}}
									htmlFor="exercise-selection"
									className="btn"
								>
									Close
								</label>

								<button type="submit" className="btn">
									Add Exercise
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
