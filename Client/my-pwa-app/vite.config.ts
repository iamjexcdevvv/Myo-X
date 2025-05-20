import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import mkcert from "vite-plugin-mkcert";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const apiBaseUrl = env.VITE_API_BASE_URL;

	return {
		plugins: [
			mkcert(),
			tailwindcss(),
			react(),
			VitePWA({
				registerType: "prompt",
				includeAssets: [
					"/favicon.ico",
					"/apple-touch-icon.png",
					"/mask-icon.svg",
				],
				manifest: {
					name: "Myo X",
					short_name: "Myo X",
					description: "Scienced based workout tracker",
					theme_color: "#0f172a",
					icons: [
						{
							src: "/pwa-192x192.png",
							sizes: "192x192",
							type: "image/png",
						},
						{
							src: "/pwa-512x512.png",
							sizes: "512x512",
							type: "image/png",
						},
						{
							src: "/pwa-512x512.png",
							sizes: "512x512",
							type: "image/png",
							purpose: "any maskable",
						},
					],
				},
				workbox: {
					globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
					navigateFallback: "/index.html",
					navigateFallbackAllowlist: [
						/^\/dashboard/,
						/^\/workouts/,
						/^\/$/,
					],
					runtimeCaching: [
						{
							urlPattern: ({ request }) =>
								request.destination === "document",
							handler: "NetworkFirst",
							options: {
								cacheName: "app-shell",
								expiration: {
									maxEntries: 10,
									maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
								},
							},
						},
						{
							urlPattern: new RegExp(
								`${apiBaseUrl}/WorkoutSessionLog`.replace(
									/[.*+?^${}()|[\]\\]/g,
									"\\$&"
								)
							),
							handler: "NetworkFirst",
							options: {
								cacheName: "workout-session-history-cache",
								expiration: {
									maxEntries: 50,
									maxAgeSeconds: 60 * 60,
								},
								cacheableResponse: {
									statuses: [0, 200],
								},
							},
						},
					],
				},
			}),
		],
	};
});
