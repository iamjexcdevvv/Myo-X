import { createContext } from "react";
import { WorkoutSessionLog } from "../types/WorkoutSessionLogType";

interface UserExercisesContextType {
	userExercises: WorkoutSessionLog[];
	setUserExercises: React.Dispatch<React.SetStateAction<WorkoutSessionLog[]>>;
	workoutDuration: number;
	setWorkoutDuration: React.Dispatch<React.SetStateAction<number>>;
}

export const UserWorkoutSessionContext =
	createContext<UserExercisesContextType | null>(null);
