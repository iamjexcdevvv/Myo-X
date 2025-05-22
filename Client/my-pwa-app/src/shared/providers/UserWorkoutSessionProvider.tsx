import { useState } from "react";
import { UserWorkoutSessionContext } from "../../context/UserExercisesContext";
import { WorkoutSessionLog } from "../../types/WorkoutSessionLogType";

export default function UserExercisesProvider({
	children,
}: React.PropsWithChildren) {
	const [userExercises, setUserExercises] = useState<WorkoutSessionLog[]>([]);

	// const startRestTimer = () => {

	// };

	// const stopRestTimer = () => {};

	return (
		<UserWorkoutSessionContext.Provider
			value={{ userExercises, setUserExercises }}
		>
			{children}
		</UserWorkoutSessionContext.Provider>
	);
}
