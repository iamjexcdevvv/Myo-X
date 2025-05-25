import db from "../database/offlineDB";
import { ActiveWorkoutSession } from "../types/ActiveWorkoutSessionType";

const ACTIVE_WORKOUT_ID = "ACTIVE_WORKOUT";

export const saveActiveWorkoutSession = (
	activeWorkoutSession: ActiveWorkoutSession
) => {
	let saveWorkoutTimeout: ReturnType<typeof setTimeout> | null = null;

	if (saveWorkoutTimeout) clearTimeout(saveWorkoutTimeout);

	saveWorkoutTimeout = setTimeout(() => {
		activeWorkoutSession.id = ACTIVE_WORKOUT_ID;
		db.userActiveWorkoutSession.put(activeWorkoutSession);
	}, 500);
};

export const getLastActiveWorkoutSessionLog = async () => {
	return await db.userActiveWorkoutSession.get(ACTIVE_WORKOUT_ID);
};

export const clearLastActiveWorkoutSession = () => {
	db.userActiveWorkoutSession.clear();
};
