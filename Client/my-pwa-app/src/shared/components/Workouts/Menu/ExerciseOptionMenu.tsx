import { Trash } from "lucide-react";
import { WorkoutSessionLog } from "../../../../types/WorkoutSessionLogType";
import useUserWorkoutSession from "../../../../hooks/useUserWorkoutSession";
import { saveActiveWorkoutSession } from "../../../../utils/workoutSessionUtils";

export default function ExerciseOptionMenu({
	exercise,
}: {
	exercise: WorkoutSessionLog;
}) {
	const { userExercises, setUserExercises, workoutDuration } =
		useUserWorkoutSession();

	const handleRemoveExerciseClick = () => {
		const filteredUserExercises = userExercises.filter(
			(ex) => ex.exerciseId !== exercise.exerciseId
		);

		setUserExercises(filteredUserExercises);
		saveActiveWorkoutSession({
			duration: workoutDuration,
			exercises: filteredUserExercises,
		});
	};

	return (
		<div>
			<div className="flex justify-center items-center">
				<button onClick={handleRemoveExerciseClick} className="btn">
					<Trash />
					<span>Remove Exercise</span>
				</button>
			</div>
		</div>
	);
}
