// @ts-check

import eslint from "eslint/use-at-your-own-risk";
import micromatch from "micromatch";

/**
 * @type {(name : string) => string[]}
 */
const ignoreFiles = (name) => [`.${name}ignore`, `.${name}ignore-sync`];

/**
 * @type {Record<string, string[]>}
 */
const configFiles = {
	ignoreSync: [
		...ignoreFiles("git"),
		...ignoreFiles("prettier"),
		...ignoreFiles("secretlint"),
	],
	eslint: ["eslint.config.js", ...ignoreFiles("git")],
	tsc: ["tsconfig.json"],
	markdownlint: [".markdownlint-cli2.mjs", ...ignoreFiles("git")],
	cspell: ["cspell.config.cjs", ...ignoreFiles("git")],
	secretlint: [
		".secretlintrc.cjs",
		...ignoreFiles("git"),
		...ignoreFiles("prettier"),
		...ignoreFiles("secretlint"),
	],
	prettier: [
		"prettier.config.js",
		...ignoreFiles("git"),
		...ignoreFiles("prettier"),
	],
	vitest: ["vitest.config.ts", ...ignoreFiles("git")],
};

/**
 * @type {(files: string[], pattern: string | false) => string}
 */
const filterFiles = (files, pattern) =>
	(pattern === false
		? files
		: micromatch(files, pattern, {
				dot: true,
				// @ts-expect-error - `posixSlashes` is not included in @types/micromatch
				posixSlashes: true,
				strictBrackets: true,
		  })
	).join(" ");

/**
 * @type {(files: string[]) => Promise<string>}
 */
const filterEslintIgnoredFiles = async (files) => {
	// @ts-expect-error - FlatESLint is not included in @types/eslint
	const flatEslint = new eslint.FlatESLint();
	const isIgnored = await Promise.all(
		files.map((file) => {
			return flatEslint.isPathIgnored(file);
		}),
	);
	const filteredFiles = files.filter((_, index) => !isIgnored[index]);
	return filteredFiles.join(" ");
};

/**
 * @type {import("lint-staged").Config}
 */
export default {
	"*": async (files) => {
		const containsConfigs = Object.fromEntries(
			Object.entries(configFiles).map(([linter, paths]) => [
				linter,
				files.some((file) => paths.some((path) => file.endsWith("/" + path))),
			]),
		);

		// TODO: run in parallel https://github.com/okonet/lint-staged/issues/934
		return [
			containsConfigs.ignoreSync ? "pnpm ignore-sync" : "",
			containsConfigs.eslint
				? "pnpm format:eslint"
				: `eslint --fix --max-warnings=0 ${await filterEslintIgnoredFiles(
						files,
				  )}`,
			containsConfigs.tsc
				? "pnpm lint:tsc"
				: `tsc --noEmit ${filterFiles(files, "**/*.{ts,cts,mts}")}`,
			containsConfigs.markdownlint
				? "pnpm lint:markdown"
				: `markdownlint-cli2 ${filterFiles(files, "**/*.md")}`,
			containsConfigs.cspell
				? "pnpm lint:cspell"
				: `cspell --relative --no-must-find-files ${filterFiles(files, false)}`,
			containsConfigs.secretlint
				? "pnpm lint:secret"
				: `secretlint --fix ${filterFiles(files, false)}`,
			"pnpm lint:knip",
			containsConfigs.prettier
				? "pnpm format:prettier"
				: `prettier --write --ignore-unknown ${filterFiles(files, false)}`,
			containsConfigs.vitest
				? "vitest run --no-coverage --passWithNoTests"
				: `vitest related --no-coverage --passWithNoTests --run ${filterFiles(
						files,
						false,
				  )}`,
			// if any config file was changed, add all files because they might be affected
			Object.values(containsConfigs).some(Boolean) ? "git add ." : "",
		].filter(Boolean);
	},
};
