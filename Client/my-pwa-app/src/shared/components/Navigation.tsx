import { useEffect, useState } from "react";
import { Link } from "react-router";
import { logoutUser } from "../../services/AuthService";
import { clearUserAccessToken } from "../../utils/offlineAuthUtils";
import useAuth from "../../hooks/useAuth";
import { Download, Menu, X } from "lucide-react";
import Logo from "./Logo";

interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Navigation() {
	const [showMenu, setShowMenu] = useState(false);
	const { isAuthenticated, setIsAuthenticated } = useAuth();

	const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
	const [isInstallable, setIsInstallable] = useState(false);

	const handleInstallPrompt = () => {
		if (!deferredPrompt) return;

		const promptEvent = deferredPrompt as BeforeInstallPromptEvent;

		promptEvent.prompt();

		promptEvent.userChoice.then((result) => {
			if (result.outcome === "dismissed") return;

			setIsInstallable(false);
			setDeferredPrompt(null);
		});
	};

	const handleClick = () => {
		setShowMenu((prev) => !prev);
	};

	const handleLogoutClick = () => {
		if (isAuthenticated) {
			logoutUser();
			setIsAuthenticated(false);
			clearUserAccessToken();
		}
	};

	const handleBeforeInstallPrompt = (e: Event) => {
		e.preventDefault();
		setDeferredPrompt(e);
		setIsInstallable(true);
	};

	useEffect(() => {
		window.addEventListener(
			"beforeinstallprompt",
			handleBeforeInstallPrompt
		);

		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt
			);
		};
	}, []);

	return (
		<>
			<header className="w-full bg-base-300 h-[72px] px-6 flex items-center">
				<div className="flex items-center w-full h-full space-x-4">
					<div className="lg:hidden">
						<button onClick={handleClick}>
							<Menu />
						</button>
					</div>

					<Logo />
				</div>

				<div className="flex space-x-5 items-center">
					<div>
						{!isAuthenticated ? (
							<button>
								<Link to="/auth/login">Login</Link>
							</button>
						) : (
							<button onClick={handleLogoutClick}>Logout</button>
						)}
					</div>

					{isInstallable && (
						<div>
							<button
								onClick={handleInstallPrompt}
								className="btn btn-primary flex items-center space-x-1"
							>
								<Download />
								<span>Install</span>
							</button>
						</div>
					)}
				</div>
			</header>

			<div
				className={`fixed top-0 ${
					showMenu ? "left-0" : "-left-full"
				} transition-all duration-300 bg-base-200 w-[80%] h-screen px-6 py-3 space-y-13 z-50 lg:left-0 lg:w-[35%]`}
			>
				<div className="flex justify-between items-center">
					<div>
						<Logo />
					</div>

					<div className="lg:hidden">
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
