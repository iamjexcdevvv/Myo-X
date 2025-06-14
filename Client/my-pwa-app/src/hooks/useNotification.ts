import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

export default function useNotification() {
	const context = useContext(NotificationContext);

	if (context === null) {
		throw new Error(
			"useNotification must be used within an NotificationProvider"
		);
	}

	return context;
}
