import { useEffect } from "react";
import Navigation from "./components/Navigation";
import { registerSW } from "virtual:pwa-register";
import { toast, ToastContainer } from "react-toastify";
import AlertNotification from "./components/Notification/AlertNotification";

export default function Layout({ children }: React.PropsWithChildren) {
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
		<>
			<Navigation />
			<AlertNotification />
			<main className="w-full h-[calc(100vh-72px)]">{children}</main>
			<ToastContainer />
		</>
	);
}
