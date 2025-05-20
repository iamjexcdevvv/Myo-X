import { createContext } from "react";
import { NotificationType } from "../types/NotificationType";

type NotificationTypeContext = {
	currentNotification: NotificationType | null;
	addNotification: (notification: NotificationType) => void;
	clearNotifications: () => void;
};

export const NotificationContext =
	createContext<NotificationTypeContext | null>(null);
