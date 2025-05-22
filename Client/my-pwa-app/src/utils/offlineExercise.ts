import db from "../database/offlineDB";
import { ExerciseData } from "../types/ExerciseDataType";

export const populateExercises = async () => {
	if ((await db.exercises.count()) === 0) {
		const request = await fetch("/exercises.json");
		const exercises = await request.json();

		const exerciseToAdd = exercises.map((exercise: ExerciseData) => {
			return {
				id: exercise.id,
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

		db.exercises.add({
			id: "EXERCISES",
			exercises: exerciseToAdd,
		});
	}
};

export const filterExercisesByName = async (exerciseName: string) => {
	const availableExercises = await db.exercises
		.where("id")
		.equals("EXERCISES")
		.first();

	if (availableExercises && availableExercises.exercises.length > 0) {
		const filteredExercises = availableExercises.exercises.filter(
			(exercise) =>
				exercise.name.toLowerCase().includes(exerciseName.toLowerCase())
		);

		return filteredExercises;
	}

	return [];
};
