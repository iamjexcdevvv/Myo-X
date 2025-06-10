import { useEffect } from "react";
import Navigation from "./components/Navigation";
import AlertNotification from "./components/Notification/AlertNotification";
import AuthProvider from "./providers/AuthProvider";
import NotificationProvider from "./providers/NotificationProvider";
import UserExercisesProvider from "./providers/UserWorkoutSessionProvider";
import { Outlet } from "react-router";
import { registerSW } from "virtual:pwa-register";
import { toast, ToastContainer } from "react-toastify";

export default function Layout() {
	useEffect(() => {
		const updateSW = registerSW({
			onNeedRefresh() {
				toast.info(
					<div>
						<p>New version available!</p>
						<button
							onClick={() => {
								updateSW();
								toast.dismiss();
							}}
							className="toast-button"
						>
							Update Now
						</button>
					</div>,
					{
						autoClose: false,
						closeButton: false,
						position: "bottom-center",
					}
				);
			},
			onOfflineReady() {
				console.log("App is ready for offline use!");
			},
		});
	}, []);

	return (
		<AuthProvider>
			<NotificationProvider>
				<UserExercisesProvider>
					<Navigation />
					<AlertNotification />
					<main className="w-full h-[calc(100vh-72px)]">
						<Outlet />
					</main>
					<ToastContainer />
				</UserExercisesProvider>
			</NotificationProvider>
		</AuthProvider>
	);
}
