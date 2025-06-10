import { Navigate, Outlet } from "react-router";
import { ReactNode } from "react";
import useAuth from "../hooks/useAuth";

type ProtectedRouteProps = {
	children?: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated == null) {
		return (
			<div className="w-full h-screen flex justify-center items-center">
				<span className="loading loading-spinner w-12 h-12"></span>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/auth/login" replace />;
	}

	return children ? <>{children}</> : <Outlet />;
}
