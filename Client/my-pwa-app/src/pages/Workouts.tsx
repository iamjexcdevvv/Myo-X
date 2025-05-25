import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import NewWorkout from "../shared/components/Workouts/NewWorkout";
import { populateExercises } from "../utils/offlineExercisesUtils";
import {
	clearLastActiveWorkoutSession,
	getLastActiveWorkoutSessionLog,
} from "../utils/workoutSessionUtils";
import useNotification from "../hooks/useNotification";
import useUserWorkoutSession from "../hooks/useUserWorkoutSession";
import { ActiveWorkoutSession } from "../types/ActiveWorkoutSessionType";
import {
	getQueueWorkoutSessions,
	removeQueuedWorkoutSession,
} from "../utils/syncUtils";
import { SaveWorkoutSessionLog } from "../services/LogWorkoutSessionService";

export default function Workouts() {
	const { addNotification } = useNotification();
	const { setUserExercises } = useUserWorkoutSession();

	const [isNewWorkoutStarted, setIsNewWorkoutStarted] = useState(false);

	const lastActiveWorkoutSessionModalRef = useRef<HTMLDialogElement>(null);
	const lastActiveWorkoutSessionLogRef = useRef<ActiveWorkoutSession | null>(
		null
	);

	const [queuedWorkoutSessionsCount, setQueuedWorkoutSessionsCount] =
		useState(0);

	const onResumeLastActiveWorkoutSession = async () => {
		const lastActiveWorkoutSessionLog =
			await getLastActiveWorkoutSessionLog();

		if (lastActiveWorkoutSessionLog) {
			lastActiveWorkoutSessionLogRef.current =
				lastActiveWorkoutSessionLog;
			setIsNewWorkoutStarted(true);
			setUserExercises(lastActiveWorkoutSessionLogRef.current.exercises);
		}

		lastActiveWorkoutSessionModalRef.current?.close();
	};

	const onDiscardLastActiveWorkoutSession = () => {
		lastActiveWorkoutSessionLogRef.current = null;
		clearLastActiveWorkoutSession();

		addNotification({
			type: "success",
			message: "Your last active workout session has been discarded",
		});
	};

	useEffect(() => {
		async function checkForLastActiveWorkoutSession() {
			if (await getLastActiveWorkoutSessionLog()) {
				lastActiveWorkoutSessionModalRef.current?.showModal();
			}
		}

		async function syncQueuedWorkoutSessions() {
			const userQueuedWorkoutSessions = await getQueueWorkoutSessions();

			if (userQueuedWorkoutSessions.length > 0) {
				for (const workoutSession of userQueuedWorkoutSessions) {
					if (workoutSession.id && workoutSession.payload) {
						const success = await SaveWorkoutSessionLog({
							exercises: workoutSession.payload?.exercises,
							workoutSessionDate:
								workoutSession.payload?.workoutSessionDate,
						});

						if (!success) {
							setQueuedWorkoutSessionsCount(
								userQueuedWorkoutSessions.length
							);
							break;
						}

						removeQueuedWorkoutSession(workoutSession.id);
					}
				}
			}
		}

		checkForLastActiveWorkoutSession();
		populateExercises();
		syncQueuedWorkoutSessions();
	}, []);

	return (
		<section className="w-full h-full p-4">
			<div>
				{isNewWorkoutStarted ? (
					<NewWorkout
						setQueuedWorkoutSessionsCount={
							setQueuedWorkoutSessionsCount
						}
						setIsNewWorkoutStarted={setIsNewWorkoutStarted}
						lastActiveWorkoutSessionLogRef={
							lastActiveWorkoutSessionLogRef.current
						}
						isNewWorkoutStarted={isNewWorkoutStarted}
					/>
				) : (
					<div>
						<button
							onClick={() => setIsNewWorkoutStarted(true)}
							className="btn"
						>
							<Plus />
							<span>New Workout</span>
						</button>
					</div>
				)}
			</div>

			{queuedWorkoutSessionsCount > 0 && (
				<div className="fixed bottom-5 left-1/2 -translate-x-1/2">
					<span className="text-error">{`Failed to save ${queuedWorkoutSessionsCount} workout sessions`}</span>
				</div>
			)}

			<div>
				<dialog
					ref={lastActiveWorkoutSessionModalRef}
					id="active-workout-session-modal"
					className="modal"
				>
					<div className="modal-box">
						<div>
							<h3 className="text-lg font-bold">
								Active Workout
							</h3>
							<p className="py-4 text-warning">
								Do you want to resume your last active workout
								session?
							</p>
						</div>
						<div className="modal-action flex-wrap">
							<form method="dialog">
								{/* if there is a button in form, it will close the modal */}
								<button
									onClick={() =>
										onDiscardLastActiveWorkoutSession()
									}
									className="btn btn-error"
								>
									Discard
								</button>
							</form>
							<div>
								<button
									onClick={() =>
										onResumeLastActiveWorkoutSession()
									}
									className="btn btn-primary"
								>
									Resume
								</button>
							</div>
						</div>
					</div>
				</dialog>
			</div>
		</section>
	);
}
