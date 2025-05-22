import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import "./styles/index.css";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Layout from "./shared/Layout";
import Dashboard from "./pages/Dashboard";
import AuthProvider from "./shared/providers/AuthProvider";
import ProtectedRoute from "./shared/ProtectedRoute";
import NotificationProvider from "./shared/providers/NotificationProvider";
import Workouts from "./pages/Workouts";
import UserExercisesProvider from "./shared/providers/UserWorkoutSessionProvider";

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<AuthProvider>
			<NotificationProvider>
				<Routes>
					<Route
						path="/"
						element={
							<Layout>
								<App />
							</Layout>
						}
					/>

					<Route element={<ProtectedRoute />}>
						<Route
							path="/dashboard"
							element={
								<Layout>
									<Dashboard />
								</Layout>
							}
						/>

						<Route
							path="/workouts"
							element={
								<Layout>
									<UserExercisesProvider>
										<Workouts />
									</UserExercisesProvider>
								</Layout>
							}
						/>
					</Route>

					<Route path="/auth">
						<Route
							path="login"
							element={
								<Layout>
									<Login />
								</Layout>
							}
						/>
						<Route
							path="register"
							element={
								<Layout>
									<Register />
								</Layout>
							}
						/>
					</Route>
				</Routes>
			</NotificationProvider>
		</AuthProvider>
	</BrowserRouter>
);
