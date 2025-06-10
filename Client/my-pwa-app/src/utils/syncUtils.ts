import db from "../database/offlineDB";
import { logoutUser } from "../services/AuthService";
import { SyncAction } from "../types/SyncActionType";
import { WorkoutSessionLog } from "../types/WorkoutSessionLogType";
import { getCurrentDateWithUserTimezone } from "./utils";

export const queueLogout = async () => {
	await db.syncQueue.add({
		action: "logout",
	});
};

export const getQueuedLogoutAction = async () => {
	const items = (await db.syncQueue.toArray()).filter(
		(item) => item.action === "logout"
	);

	return items;
};

export const syncLogoutAction = async (items: SyncAction[]) => {
	if (items.length > 0) {
		if (items[0].id !== undefined) {
			await db.syncQueue.delete(items[0].id);
			logoutUser();
		}
	}
};

export const queueWorkoutSession = async (
	workoutSessionLog: WorkoutSessionLog[]
) => {
	await db.syncQueue.add({
		action: "saveWorkoutSession",
		payload: {
			exercises: workoutSessionLog,
			workoutSessionDate: getCurrentDateWithUserTimezone(),
		},
	});
};

export const removeQueuedWorkoutSession = (id: number) => {
	db.syncQueue.delete(id);
};

export const getQueueWorkoutSessions = async () => {
	const queuedActions = await db.syncQueue.toArray();

	const items = queuedActions.filter(
		(item) => item.action === "saveWorkoutSession"
	);

	return items;
};
