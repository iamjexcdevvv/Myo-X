export type ExerciseData = {
	id?: number;
	exerciseId: string;
	name: string;
	force: string | null;
	level: string;
	mechanic: string | null;
	equipment: string | null;
	primaryMuscles: string[];
	secondaryMuscles: string[];
	instructions: string[];
	category: string;
	images: string[];
};
