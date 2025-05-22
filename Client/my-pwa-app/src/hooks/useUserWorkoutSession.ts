import { useContext } from "react";
import { UserWorkoutSessionContext } from "../context/UserExercisesContext";

export default function useUserWorkoutSession() {
	const context = useContext(UserWorkoutSessionContext);

	if (context === null) {
		throw new Error(
			"useUserExercises must be used within an UserExercisesProvider"
		);
	}

	return context;
}
