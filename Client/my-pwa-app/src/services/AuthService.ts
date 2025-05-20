import { getUserAccessToken } from "../utils/offlineAuth";
import { queueLogout } from "../utils/offlineSync";

export async function authenticateUser() {
	try {
		const request = await fetch(
			`${import.meta.env.VITE_API_BASE_URL}/auth/check`,
			{
				method: "GET",
				credentials: "include",
			}
		);

		if (!request.ok && request.status === 401) {
			const isRefreshed = await refreshUserToken();

			if (!isRefreshed) {
				return false;
			}
		}
		return true;
	} catch (error) {
		console.log(error);

		const accessToken = await getUserAccessToken();

		console.log(accessToken);

		if (accessToken) return true;
	}

	return false;
}

export async function registerUser(
	email: string,
	password: string,
	confirmPassword: string
) {
	try {
		const request = await fetch(
			`${import.meta.env.VITE_API_BASE_URL}/auth/register`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					Email: email,
					Password: password,
					ConfirmPassword: confirmPassword,
				}),
			}
		);

		return await request.json();
	} catch (error) {
		console.log(error);
	}
}

export async function refreshUserToken() {
	try {
		const request = await fetch(
			`${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
			{
				method: "POST",
				credentials: "include",
			}
		);

		return request.ok;
	} catch (error) {
		console.log(error);
	}
}

export async function userLogin(email: string, password: string) {
	try {
		const request = await fetch(
			`${import.meta.env.VITE_API_BASE_URL}/auth/login`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ Email: email, Password: password }),
			}
		);

		return await request.json();
	} catch (error) {
		console.log(error);
	}
}

export async function logoutUser() {
	try {
		const request = await fetch(
			`${import.meta.env.VITE_API_BASE_URL}/auth/logout`,
			{
				method: "POST",
				credentials: "include",
			}
		);

		if (request.ok) {
			window.location.reload();
		}
	} catch (error) {
		console.log(error);
		await queueLogout();
	}
}
