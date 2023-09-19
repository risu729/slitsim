// @ts-check

import { gitignoreToMinimatch } from "@humanwhocodes/gitignore-to-minimatch";
import { readGitignoreFiles } from "eslint-gitignore";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
	config: {
		extends: "markdownlint/style/prettier",
		"no-bare-urls": false,
	},
	fix: true,
	ignores: [".git/", ...readGitignoreFiles({ cwd: __dirname })].map(
		(ignorePattern) => gitignoreToMinimatch(ignorePattern),
	),
};
