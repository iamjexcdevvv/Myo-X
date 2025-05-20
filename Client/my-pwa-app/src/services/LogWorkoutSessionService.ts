import { WorkoutSessionLog } from "../types/WorkoutSessionLogType";

export async function SaveWorkoutSessionLog(
	workoutSessionLog: WorkoutSessionLog[]
) {
	try {
		const workoutSession = {
			exercises: [...workoutSessionLog],
		};

		const request = await fetch(
			`${import.meta.env.VITE_API_BASE_URL}/WorkoutSessionLog`,
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
		console.log(error);
		return false;
	}
}

export async function getAllUserWorkoutSessions() {
	try {
		const request = await fetch(
			`${import.meta.env.VITE_API_BASE_URL}/WorkoutSessionLog`,
			{
				method: "GET",
				credentials: "include",
			}
		);

		return await request.json();
	} catch (error) {
		console.log(error);
	}
}
