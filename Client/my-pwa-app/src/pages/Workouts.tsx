// import { clearUserActiveWorkoutSession } from "../utils/offlineExercise";

import { useEffect, useState } from "react";
import NewWorkout from "../shared/components/Workouts/NewWorkout";
import {
	getQueueWorkoutSessions,
	removeQueuedWorkoutSession,
} from "../utils/offlineSync";
import { SaveWorkoutSessionLog } from "../services/LogWorkoutSessionService";
import { getActiveWorkoutSession } from "../utils/offlineExercise";
import useUserExercises from "../hooks/useUserExercises";
import { SyncAction } from "../types/SyncActionType";

// TODO: Save active workout session
// TODO: Add rest timer option
// TODO: Add remove exercise option
// TODO: Add add set button

export default function Workouts() {
	const [startWorkoutSession, setStartWorkoutSession] = useState(false);
	const { setUserExercises } = useUserExercises();

	const [queuedWorkoutSessions, setQueuedWorkoutSessions] = useState<
		SyncAction[]
	>([]);

	async function handleContinueActiveWorkoutSessionClick() {
		const activeWorkoutSession = await getActiveWorkoutSession();

		if (activeWorkoutSession) {
			setStartWorkoutSession(true);
			setUserExercises(activeWorkoutSession.exercises);

			const modal = document.getElementById(
				"active-workout-session"
			) as HTMLDialogElement;

			modal.close();
		}
	}

	useEffect(() => {
		async function processSyncQueuedWorkoutSessions() {
			const items = await getQueueWorkoutSessions();

			if (items.length > 0) {
				for (const item of items) {
					if (!item.payload || !item.id) continue;

					const isSaved = await SaveWorkoutSessionLog(item.payload);

					if (!isSaved) {
						setQueuedWorkoutSessions(items);
						return;
					}

					removeQueuedWorkoutSession(item.id);
				}
			}
		}

		async function checkForAnyActiveWorkoutSession() {
			const activeWorkoutSession = await getActiveWorkoutSession();

			if (activeWorkoutSession) {
				const modal = document.getElementById(
					"active-workout-session"
				) as HTMLDialogElement;

				modal.showModal();
			}
		}

		processSyncQueuedWorkoutSessions();
		checkForAnyActiveWorkoutSession();
	}, []);

	return (
		<section className="w-full h-full p-4 space-y-2 text-nowrap">
			{!startWorkoutSession && (
				<button
					onClick={() => setStartWorkoutSession(true)}
					className="btn"
				>
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
							d="M12 4.5v15m7.5-7.5h-15"
						/>
					</svg>
					<span>New Workout</span>
				</button>
			)}

			{startWorkoutSession && (
				<NewWorkout
					setStartWorkoutSession={setStartWorkoutSession}
					startWorkoutSession={startWorkoutSession}
					queuedWorkoutSessions={queuedWorkoutSessions}
					setQueuedWorkoutSessions={setQueuedWorkoutSessions}
				/>
			)}

			{queuedWorkoutSessions.length > 0 && (
				<div className="fixed bottom-10 left-1/2 -translate-x-1/2">
					<span className="text-xs text-error">
						{`There is ${queuedWorkoutSessions.length} workout session(s) failed to save. It will be
									save when you get back online`}
					</span>
				</div>
			)}

			<dialog id="active-workout-session" className="modal">
				<div className="modal-box">
					<div>
						<h6 className="font-bold text-lg text-warning text-wrap">
							Active Workout Session
						</h6>
						<p className="text-wrap">
							You have an active workout session. Do you want to
							continue?
						</p>
					</div>
					<div className="modal-action flex-wrap">
						<form method="dialog">
							{/* if there is a button in form, it will close the modal */}
							<button className="btn btn-error">Discard</button>
						</form>

						<div>
							<button
								onClick={
									handleContinueActiveWorkoutSessionClick
								}
								className="btn btn-primary"
							>
								Continue
							</button>
						</div>
					</div>
				</div>
			</dialog>
		</section>
	);
}
