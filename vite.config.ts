import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import {VitePWA} from "vite-plugin-pwa";
import {defineConfig} from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("react")) {
						return "react";
					} else if (id.includes("chakra")) {
						return "chakra";
					} else if (id.includes("node_modules")) {
						return "vendor";
					}
				},
			},
		},
	},
	plugins: [
		tsconfigPaths(),
		react(),
		VitePWA({
			includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
			manifest: {
				name: "Numsgil Co",
				short_name: "Numsgil Co",
				description: "Pathfinder Hero Editor and Combat tracker",
				theme_color: "#ffffff",
				display: "standalone",
				icons: [
					{
						src: "pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any maskable",
					},
				],
			},
		}),
	],
});
