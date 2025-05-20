import { useEffect, useState } from "react";
import { NotificationContext } from "../../context/NotificationContext";
import { NotificationType } from "../../types/NotificationType";

export default function NotificationProvider({
	children,
}: React.PropsWithChildren) {
	const [notificationQueue, setNotificationQueue] = useState<
		NotificationType[]
	>([]);
	const [currentNotification, setCurrentNotification] =
		useState<NotificationType | null>(null);

	useEffect(() => {
		if (notificationQueue.length > 0 && !currentNotification) {
			setCurrentNotification(notificationQueue[0]);
			setNotificationQueue((prev) => prev.slice(1));
		}
	}, [notificationQueue, currentNotification]);

	useEffect(() => {
		if (!currentNotification) return;

		const timer = setTimeout(() => {
			setCurrentNotification(null);
		}, 2000);

		return () => clearTimeout(timer);
	}, [currentNotification]);

	const addNotification = (notification: NotificationType) => {
		setNotificationQueue((prev) => [...prev, notification]);
	};

	const clearNotifications = () => {
		setNotificationQueue([]);
		setCurrentNotification(null);
	};

	return (
		<NotificationContext.Provider
			value={{ currentNotification, addNotification, clearNotifications }}
		>
			{children}
		</NotificationContext.Provider>
	);
}
