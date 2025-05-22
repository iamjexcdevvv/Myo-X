import { WorkoutSessionLog } from "./WorkoutSessionLogType";

export type ActiveWorkoutSession = {
	id?: string;
	duration?: number;
	exercises: WorkoutSessionLog[];
};
