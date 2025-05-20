import { createContext } from "react";
import { WorkoutSessionLog } from "../types/WorkoutSessionLogType";

interface UserExercisesContextType {
	userExercises: WorkoutSessionLog[];
	setUserExercises: React.Dispatch<React.SetStateAction<WorkoutSessionLog[]>>;
	restTimeLeft: number | null;
	clearRestTimer: () => void;
	setupRestTimer: (exercise: WorkoutSessionLog, setId: number) => void;
	currentActiveSetId: number | null;
	currentActiveExerciseId: string | null;
	toggleSetTimer: boolean;
	setWorkoutSessionLog: React.Dispatch<
		React.SetStateAction<WorkoutSessionLog[]>
	>;
	workoutSessionLog: WorkoutSessionLog[];
}

export const UserExercisesContext =
	createContext<UserExercisesContextType | null>(null);
