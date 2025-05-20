import { WorkoutSessionLog } from "./WorkoutSessionLogType";

export type SyncAction = {
	id?: number;
	action: string;
	payload?: WorkoutSessionLog[];
};
