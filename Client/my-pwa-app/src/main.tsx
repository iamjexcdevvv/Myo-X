import { createRoot } from "react-dom/client";
import { routes } from "./routes";
import { RouterProvider } from "react-router";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={routes} />
	</StrictMode>
);
