// @ts-check

import js from "@eslint/js";
import { gitignoreToMinimatch } from "@humanwhocodes/gitignore-to-minimatch";
import nextPlugin from "@next/eslint-plugin-next";
import tsPlugin from "@typescript-eslint/eslint-plugin";
// @ts-expect-error missing type declaration
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import vitestGlobals from "eslint-config-vitest-globals";
import { readGitignoreFiles } from "eslint-gitignore";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import unicornPlugin from "eslint-plugin-unicorn";
import vitestPlugin from "eslint-plugin-vitest";
import ymlPlugin from "eslint-plugin-yml";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ymlParser from "yaml-eslint-parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
	{
		ignores: [
			...readGitignoreFiles({ cwd: __dirname }).map((ignorePattern) =>
				gitignoreToMinimatch(ignorePattern),
			),
			"pnpm-lock.yaml",
		],
	},
	{
		linterOptions: {
			reportUnusedDisableDirectives: true,
		},
	},
	{
		// config common to all js/ts files
		files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,mts,cts,tsx,mtsx}"],
		plugins: {
			unicorn: unicornPlugin,
		},
		rules: {
			...js.configs.recommended.rules,
			...unicornPlugin.configs.recommended.rules,
			"no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
			"unicorn/no-array-for-each": "off",
			"unicorn/prevent-abbreviations": [
				"error",
				{
					allowList: {
						i: true,
						j: true,
						k: true,
						props: true,
					},
				},
			],
		},
	},
	{
		// ts config for ts files
		files: ["**/*.{ts,mts,cts,tsx,mtsx}"],
		plugins: {
			"@typescript-eslint": tsPlugin,
		},
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: path.resolve(__dirname, "tsconfig.json"),
			},
		},
		rules: {
			...tsPlugin.configs["eslint-recommended"].rules,
			...tsPlugin.configs["strict-type-checked"].rules,
			...tsPlugin.configs["stylistic-type-checked"].rules,
		},
	},
	{
		// next config for Next.js files
		files: ["src/**/*.{js,mjs,cjs,jsx,mjsx,ts,mts,cts,tsx,mtsx}"],
		plugins: {
			"@next/next": nextPlugin,
			react: reactPlugin,
			"react-hooks": reactHooksPlugin,
			"jsx-a11y": jsxA11yPlugin,
		},
		rules: {
			...nextPlugin.configs.recommended.rules,
			...nextPlugin.configs["core-web-vitals"].rules,
			...reactPlugin.configs.recommended.rules,
			...reactPlugin.configs["jsx-runtime"].rules,
			...reactHooksPlugin.configs.recommended.rules,
			...jsxA11yPlugin.configs.strict.rules,
		},
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},
	{
		// yml config for GitHub Actions
		files: ["**/*.{yml,yaml}"],
		plugins: {
			yml: ymlPlugin,
		},
		languageOptions: {
			parser: ymlParser,
		},
		rules: {
			...ymlPlugin.configs.base.overrides[0].rules,
			...ymlPlugin.configs.standard.rules,
			"yml/no-empty-mapping-value": "off",
		},
	},
	{
		// vitest config for test files
		files: ["tests/**/*.test.{js,mjs,cjs,jsx,mjsx,ts,mts,cts,tsx,mtsx}"],
		languageOptions: {
			globals: vitestGlobals.globals,
		},
		plugins: {
			vitest: vitestPlugin,
		},
		rules: vitestPlugin.configs.all.rules,
	},
	{
		// node globals for config files
		files: ["*.{js,mjs,cjs,ts,mts,cts}"],
		languageOptions: {
			globals: globals.node,
		},
	},
	{
		// disable rules that conflict with prettier
		rules: { ...prettierConfig.rules, ...ymlPlugin.configs.prettier.rules },
	},
];
