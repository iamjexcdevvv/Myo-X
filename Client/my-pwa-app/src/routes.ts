import { createBrowserRouter } from "react-router";
import Layout from "./shared/Layout";
import Home from "./pages/Home";
import ProtectedRoute from "./shared/ProtectedRoute";
import NotFound from "./shared/components/NotFound";
import PageLoading from "./shared/components/PageLoading";
import Dashboard from "./pages/Dashboard";
import RouteError from "./shared/components/RouteError";

export const routes = createBrowserRouter([
	{
		path: "*",
		Component: NotFound,
	},
	{
		Component: Layout,
		HydrateFallback: PageLoading,
		ErrorBoundary: RouteError,
		children: [
			{
				path: "/",
				Component: Home,
			},
			{
				Component: ProtectedRoute,
				children: [
					{
						path: "dashboard",
						Component: Dashboard,
					},
					{
						path: "workouts",
						async lazy() {
							const { default: Workouts } = await import(
								"./pages/Workouts"
							);
							return { Component: Workouts };
						},
					},
				],
			},
			{
				path: "auth",
				children: [
					{
						path: "login",
						async lazy() {
							const { default: Login } = await import(
								"./pages/Auth/Login"
							);
							return { Component: Login };
						},
					},
					{
						path: "register",
						async lazy() {
							const { default: Register } = await import(
								"./pages/Auth/Register"
							);
							return { Component: Register };
						},
					},
				],
			},
		],
	},
]);
