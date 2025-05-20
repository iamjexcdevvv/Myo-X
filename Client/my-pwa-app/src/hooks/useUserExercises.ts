import { useContext } from "react";
import { UserExercisesContext } from "../context/UserExercisesContext";

export default function useUserExercises() {
	const context = useContext(UserExercisesContext);

	if (context === null) {
		throw new Error(
			"useUserExercises must be used within an UserExercisesProvider"
		);
	}

	return context;
}
