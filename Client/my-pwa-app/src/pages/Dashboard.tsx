import { useEffect, useState } from "react";
import { getAllUserWorkoutSessions } from "../services/LogWorkoutSessionService";
import { WorkoutSessionLog } from "../types/WorkoutSessionLogType";
import { formatDate } from "../utils/utils";

export default function Dashboard() {
	const [workoutSessionHistory, setWorkoutSessionHistory] = useState<
		{
			id: number;
			workoutSessionDate: string;
			exercises: WorkoutSessionLog[];
		}[]
	>([]);

	useEffect(() => {
		async function displayWorkoutSessionHistory() {
			const response = await getAllUserWorkoutSessions();

			setWorkoutSessionHistory(response);
		}

		displayWorkoutSessionHistory();
	}, []);

	return (
		<section className="w-full h-full px-4 space-y-2">
			<h1 className="text-xl">Workout History</h1>

			{workoutSessionHistory.map((workoutSession) => {
				return (
					<div
						key={workoutSession.id}
						className="max-h-48 overflow-auto border-base-300 border-2 p-4"
					>
						<h1 className="text-xl">
							{formatDate(workoutSession.workoutSessionDate)}
						</h1>

						<div className="overflow-x-auto">
							{workoutSession.exercises.map((exercise) => {
								return (
									<div key={exercise.exerciseId}>
										<div>
											<h6 className="font-bold">
												{exercise.exerciseName}
											</h6>
											<span className="text-sm">
												{`${exercise.sets.length} sets of ${exercise.repRangeStart} to ${exercise.repRangeEnd} reps`}
											</span>
										</div>

										<table className="table">
											{/* head */}
											<thead>
												<tr>
													<th></th>
													<th>Reps</th>
													<th>Load</th>
													<th>RIR</th>
												</tr>
											</thead>
											<tbody>
												{exercise.sets.map((set) => {
													return (
														<tr
															key={set.set}
															className="hover:bg-base-300"
														>
															<th>{set.set}</th>
															<td>{set.reps}</td>
															<td>{set.load}</td>
															<td>{set.rir}</td>
														</tr>
													);
												})}
											</tbody>
										</table>
									</div>
								);
							})}
						</div>
					</div>
				);
			})}
		</section>
	);
}
