import { useState } from "react";
import { Link } from "react-router";
import { logoutUser } from "../../services/AuthService";
import { clearUserAccessToken } from "../../utils/offlineAuth";
import useAuth from "../../hooks/useAuth";

export default function Navigation() {
	const [showMenu, setShowMenu] = useState(false);
	const { isAuthenticated, setIsAuthenticated } = useAuth();

	function handleClick() {
		setShowMenu(!showMenu);
	}

	function handleLogoutClick() {
		if (isAuthenticated) {
			logoutUser();
			setIsAuthenticated(false);
			clearUserAccessToken();
		}
	}

	return (
		<>
			<div
				className={`fixed left-0 top-0 z-20 bg-base-300 font-primary h-full w-4/5 space-y-10 px-3 py-2 ${
					showMenu ? "translate-x-0" : "-translate-x-full"
				} duration-300 transition-transform sm:w-1/2`}
			>
				<div className="flex justify-between">
					<div>
						<Link to="/">
							<div className="flex items-center space-x-2">
								<img
									className="w-10 h-10"
									src="/myo-x.svg"
									alt="myo-x"
								/>
								<h1 className="font-bold text-nowrap text-xl">
									Myo X
								</h1>
							</div>
						</Link>
					</div>

					<div className="flex-none">
						<button
							onClick={handleClick}
							className="btn btn-square btn-ghost"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18 18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>

				<nav>
					<ul className="space-y-3">
						<li>
							<Link to="/dashboard">Dashboard</Link>
						</li>

						<li>
							<Link to="/workouts">Workouts</Link>
						</li>
					</ul>
				</nav>
			</div>

			<header className="flex justify-between p-4 bg-base-300">
				<div className="flex">
					{isAuthenticated && (
						<div className="flex-none">
							<button
								onClick={handleClick}
								className="btn btn-square btn-ghost"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									className="inline-block h-5 w-5 stroke-current"
								>
									{" "}
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4 6h16M4 12h16M4 18h16"
									></path>{" "}
								</svg>
							</button>
						</div>
					)}

					<Link to="/">
						<div className="flex items-center space-x-2">
							<img
								className="w-10 h-10"
								src="/myo-x.svg"
								alt="myo-x"
							/>
							<h1 className="font-bold text-xl text-nowrap">
								Myo X
							</h1>
						</div>
					</Link>
				</div>

				<div className="flex items-center">
					<Link
						onClick={handleLogoutClick}
						to={isAuthenticated ? "/" : "/auth/login"}
					>
						{isAuthenticated ? "Logout" : "Login"}
					</Link>
				</div>
			</header>

			{showMenu && (
				<div
					onClick={() => setShowMenu(false)}
					className="fixed w-full h-full z-10"
				></div>
			)}
		</>
	);
}
