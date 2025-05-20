import { useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { authenticateUser } from "../../services/AuthService";
import { useLocation } from "react-router";
import {
	getQueuedLogoutAction,
	syncLogoutAction,
} from "../../utils/offlineSync";

export default function AuthProvider({ children }: React.PropsWithChildren) {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
		null
	);

	const location = useLocation();

	useEffect(() => {
		async function checkAuth() {
			const queuedLogoutAction = await getQueuedLogoutAction();

			if (queuedLogoutAction.length === 0) {
				const isAuthenticated = await authenticateUser();
				setIsAuthenticated(isAuthenticated);
				return;
			}

			syncLogoutAction(queuedLogoutAction);
			setIsAuthenticated(false);
		}

		if (
			location.pathname !== "/auth/login" &&
			location.pathname !== "/auth/register"
		) {
			checkAuth();
		}
	}, [location]);

	return (
		<AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
}
