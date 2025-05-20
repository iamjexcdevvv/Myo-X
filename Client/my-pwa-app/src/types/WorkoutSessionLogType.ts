// export default interface UserExerciseData {
// 	exerciseId: string;
// 	exerciseName: string;
// 	sets: { set: number; finished: boolean }[];
// 	repStart: number;
// 	repsEnd: number;
// 	restTimer: number | null;
// }

export type WorkoutSessionLog = {
	exerciseId: string;
	exerciseName: string;
	repRangeStart: number;
	repRangeEnd: number;
	sets: {
		set: number;
		reps?: number;
		load?: number;
		rir?: number;
		finished?: boolean;
	}[];
	restTimer: number | null;
}
