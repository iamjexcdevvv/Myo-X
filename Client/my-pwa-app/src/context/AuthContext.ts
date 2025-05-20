import { createContext } from "react";

type AuthContextType = {
	isAuthenticated: boolean | null;
	setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
