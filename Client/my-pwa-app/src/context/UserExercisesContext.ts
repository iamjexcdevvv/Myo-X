import { createContext } from "react";
import { WorkoutSessionLog } from "../types/WorkoutSessionLogType";

interface UserExercisesContextType {
	userExercises: WorkoutSessionLog[];
	setUserExercises: React.Dispatch<React.SetStateAction<WorkoutSessionLog[]>>;
}

export const UserWorkoutSessionContext =
	createContext<UserExercisesContextType | null>(null);
