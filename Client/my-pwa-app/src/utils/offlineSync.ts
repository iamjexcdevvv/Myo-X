import db from "../database/offlineDB";
import { logoutUser } from "../services/AuthService";
import { SyncAction } from "../types/SyncActionType";
import { WorkoutSessionLog } from "../types/WorkoutSessionLogType";

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
		payload: workoutSessionLog,
	});
};

export const removeQueuedWorkoutSession = (id: number) => {
	console.log(id);
	db.syncQueue.delete(id);
};

export const getQueueWorkoutSessions = async () => {
	const items = await db.syncQueue.toArray();

	if (items.length > 0) {
		return items.filter((item) => item.action === "saveWorkoutSession");
	}

	return items;
};
