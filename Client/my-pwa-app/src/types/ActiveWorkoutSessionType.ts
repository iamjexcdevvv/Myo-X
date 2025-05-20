import { WorkoutSessionLog } from "./WorkoutSessionLogType";

export type ActiveWorkoutSession = {
	id?: string;
	exercises: WorkoutSessionLog[];
};
