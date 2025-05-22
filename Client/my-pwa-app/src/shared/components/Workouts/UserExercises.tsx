import { Plus, Settings2 } from "lucide-react";
import { WorkoutSessionLog } from "../../../types/WorkoutSessionLogType";
import ExerciseSets from "./ExerciseSets";

export default function UserExercises({
	exercise,
	handleAddSetClick,
	handleRemoveSetClick,
}: {
	exercise: WorkoutSessionLog;
	handleAddSetClick: (exerciseId: string) => void;
	handleRemoveSetClick: (exerciseId: string, setId: number) => void;
}) {
	return (
		<div className="collapse relative bg-base-100 border-base-300 border">
			<input type="checkbox" />
			<div className="collapse-title font-semibold">
				<h6>{exercise.exerciseName}</h6>
				<span className="text-xs">{`${exercise.sets.length} sets of ${exercise.repRangeStart} to ${exercise.repRangeEnd} reps`}</span>
			</div>
			<div className="collapse-content text-sm space-y-2">
				<div className="flex justify-around">
					<h6>Reps</h6>
					<h6>Load</h6>
					<h6>RIR</h6>
					<h6>Action</h6>
				</div>
				{[...Array(exercise.sets.length)].map((_, index) => (
					<ExerciseSets
						key={exercise.exerciseId + index}
						exercise={exercise}
						index={index}
						handleRemoveSetClick={handleRemoveSetClick}
					/>
				))}
				<div>
					<button
						onClick={() => handleAddSetClick(exercise.exerciseId)}
						className="btn w-full"
					>
						<Plus />
						<span>Add Set</span>
					</button>
				</div>
			</div>
			<div className="absolute top-7 right-3 z-10">
				<div>
					<button>
						<Settings2 />
					</button>
				</div>
			</div>
		</div>
	);
}
