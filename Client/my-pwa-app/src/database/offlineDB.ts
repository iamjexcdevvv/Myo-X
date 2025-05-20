import Dexie from "dexie";
import { ExerciseData } from "../types/ExerciseDataType";
import { SyncAction } from "../types/SyncActionType";
import { ActiveWorkoutSession } from "../types/ActiveWorkoutSessionType";

interface UserAuth {
	id: string;
	cipherText: string;
	iv: number[];
}

const db = new Dexie("myo-x-db") as Dexie & {
	userAuth: Dexie.Table<UserAuth, number>;
	exercises: Dexie.Table<ExerciseData, number>;
	syncQueue: Dexie.Table<SyncAction, number>;
	userActiveWorkoutSession: Dexie.Table<ActiveWorkoutSession, string>;
};
db.version(9).stores({
	userAuth: "id",
	syncQueue: "++id, action, payload",
	userActiveWorkoutSession: "id, exercises",
	exercises:
		"++id, exerciseId, name, force, level, mechanic, equipment, primaryMuscles, secondaryMuscles, instructions, category, images",
});

export default db;
