import { WorkoutSessionLog } from "../../../types/WorkoutSessionLogType";
import SetForm from "./SetForm";

export default function UserExercises({
	exercise,
}: {
	exercise: WorkoutSessionLog;
}) {
	return (
		<div className="collapse relative bg-base-100 border-base-300 border overflow-auto">
			<input type="checkbox" />
			<div className="collapse-title font-semibold">
				<h6 className="text-sm">{exercise.exerciseName}</h6>
				<span className="text-xs">{`${exercise.sets.length} sets of ${exercise.repRangeStart} to ${exercise.repRangeEnd} reps`}</span>
			</div>
			<div className="absolute top-7 right-3 z-10">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="size-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
					/>
				</svg>
			</div>
			<div className="collapse-content text-sm space-y-2 overflow-hidden">
				<div className="flex justify-around">
					<span>Reps</span>
					<span>Load</span>
					<span>RIR</span>
					<span>Action</span>
				</div>

				{[...Array(exercise.sets.length)].map((_, index) => {
					return (
						<SetForm
							key={exercise.exerciseId + index}
							exercise={exercise}
							index={index}
						/>
					);
				})}
			</div>
		</div>
	);
}
