import {defineConfig, splitVendorChunkPlugin} from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import tsconfigPaths from "vite-tsconfig-paths"
import reactJsx from "vite-react-jsx";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		splitVendorChunkPlugin(),
		reactJsx(),
		reactRefresh(),
		tsconfigPaths(),
	],
});
