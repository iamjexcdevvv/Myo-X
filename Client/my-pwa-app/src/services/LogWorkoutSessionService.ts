import { WorkoutSessionLog } from "../types/WorkoutSessionLogType";

export const SaveWorkoutSessionLog = async (workoutSession: {
	exercises: WorkoutSessionLog[];
	workoutSessionDate?: string;
}) => {
	try {
		const request = await fetch(
			`${import.meta.env.VITE_API_BASE_URL}/workout-session-logs`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(workoutSession),
				credentials: "include",
			}
		);

		return request.ok;
	} catch (error) {
		console.error(error);
		return false;
	}
};

export const getAllUserWorkoutSessions = async () => {
	try {
		const request = await fetch(
			`${import.meta.env.VITE_API_BASE_URL}/workout-session-logs`,
			{
				method: "GET",
				credentials: "include",
			}
		);

		return await request.json();
	} catch (error) {
		console.error(error);
	}
};
