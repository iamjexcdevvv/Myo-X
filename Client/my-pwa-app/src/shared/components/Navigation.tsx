import { useState } from "react";
import { Link } from "react-router";
import { logoutUser } from "../../services/AuthService";
import { clearUserAccessToken } from "../../utils/offlineAuthUtils";
import useAuth from "../../hooks/useAuth";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

export default function Navigation() {
	const [showMenu, setShowMenu] = useState(false);
	const { isAuthenticated, setIsAuthenticated } = useAuth();

	function handleClick() {
		setShowMenu((prev) => !prev);
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
			<header className="w-full bg-base-300 h-[72px] px-6 flex items-center">
				<div className="flex items-center w-full h-full space-x-4">
					<div>
						<button onClick={handleClick}>
							<Menu />
						</button>
					</div>

					<Logo />
				</div>

				<div>
					<div>
						{!isAuthenticated ? (
							<button>
								<Link to="/auth/login">Login</Link>
							</button>
						) : (
							<button onClick={handleLogoutClick}>Logout</button>
						)}
					</div>
				</div>
			</header>

			<div
				className={`fixed top-0 ${
					showMenu ? "left-0" : "-left-full"
				} transition-all duration-300 bg-base-200 w-[80%] h-screen px-6 py-3 space-y-13 z-50`}
			>
				<div className="flex justify-between items-center">
					<div>
						<Logo />
					</div>

					<div>
						<button onClick={handleClick}>
							<X />
						</button>
					</div>
				</div>

				<div>
					<nav>
						<ul className="space-y-4 text-xl font-bold">
							<li>
								<Link to="/dashboard">Dashboard</Link>
							</li>
							<li>
								<Link to="/workouts">Workouts</Link>
							</li>
						</ul>
					</nav>
				</div>
			</div>

			{showMenu && (
				<div
					onClick={() => setShowMenu(false)}
					className="fixed top-0 left-0 w-full h-screen z-40"
				></div>
			)}
		</>
	);
}
