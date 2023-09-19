import { gitignoreToMinimatch } from "@humanwhocodes/gitignore-to-minimatch";
import react from "@vitejs/plugin-react";
import { readGitignoreFiles } from "eslint-gitignore";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./tests/setup.ts",
		coverage: {
			enabled: true,
			all: true,
			reporter: ["text", "html", "json"],
			include: ["src/**/*"],
			exclude: [
				...configDefaults.exclude,
				...readGitignoreFiles({ cwd: __dirname }).map((ignorePattern) =>
					gitignoreToMinimatch(ignorePattern),
				),
				"**/*.d.ts",
			],
		},
	},
});
