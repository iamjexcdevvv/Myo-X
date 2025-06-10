import Dexie from "dexie";
import { ExerciseData } from "../types/ExerciseDataType";
import { SyncAction } from "../types/SyncActionType";
import { ActiveWorkoutSession } from "../types/ActiveWorkoutSessionType";

type UserAuth = {
	id: string;
	cipherText: string;
	iv: string;
	salt: string;
};

type Exercises = {
	id: string;
	exercises: ExerciseData[];
};

const db = new Dexie("myo-x-db") as Dexie & {
	userAuth: Dexie.Table<UserAuth, number>;
	exercises: Dexie.Table<Exercises, number>;
	syncQueue: Dexie.Table<SyncAction, number>;
	userActiveWorkoutSession: Dexie.Table<ActiveWorkoutSession, string>;
};
db.version(10).stores({
	userAuth: "id",
	syncQueue: "++id, action, payload",
	userActiveWorkoutSession: "id, duration, exercises",
	exercises:
		"id, exerciseId, name, force, level, mechanic, equipment, primaryMuscles, secondaryMuscles, instructions, category, images",
});

export default db;
