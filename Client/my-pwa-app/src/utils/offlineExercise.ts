import db from "../database/offlineDB";
import { ActiveWorkoutSession } from "../types/ActiveWorkoutSessionType";
import { ExerciseData } from "../types/ExerciseDataType";

const ACTIVE_WORKOUT_ID = "ACTIVE_WORKOUT";

let saveWorkoutTimeout: ReturnType<typeof setTimeout> | null = null;

export const populateExercises = async () => {
	if ((await db.exercises.count()) === 0) {
		const request = await fetch("/exercises.json");
		const exercises = await request.json();

		const exerciseToAdd = exercises.map((exercise: ExerciseData) => {
			return {
				exerciseId: exercise.id,
				name: exercise.name,
				force: exercise.force,
				level: exercise.level,
				mechanic: exercise.mechanic,
				equipment: exercise.equipment,
				primaryMuscles: exercise.primaryMuscles,
				secondaryMuscles: exercise.secondaryMuscles,
				instructions: exercise.instructions,
				category: exercise.category,
				images: exercise.images,
			};
		});

		db.exercises.bulkAdd(exerciseToAdd);
	}
};

export const filterExercisesByName = async (exerciseName: string) => {
	const availableExercises = await db.exercises.toArray();

	const filteredExercises = availableExercises.filter((exercise) =>
		exercise.name.toLowerCase().includes(exerciseName.toLowerCase())
	);

	const uniqueExercises = [
		...new Map(
			filteredExercises.map((exercise) => [exercise.exerciseId, exercise])
		).values(),
	];

	return uniqueExercises;
};

export const saveActiveWorkoutSession = (
	activeWorkoutSession: ActiveWorkoutSession
) => {
	activeWorkoutSession.id = ACTIVE_WORKOUT_ID;

	if (saveWorkoutTimeout) clearTimeout(saveWorkoutTimeout);

	saveWorkoutTimeout = setTimeout(() => {
		db.userActiveWorkoutSession.put(activeWorkoutSession);
	}, 500);
};

export const getActiveWorkoutSession = async () => {
	return await db.userActiveWorkoutSession.get(ACTIVE_WORKOUT_ID);
};
