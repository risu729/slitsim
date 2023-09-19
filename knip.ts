import type { KnipConfig } from "knip";

export default {
	ignore: [
		// markdownlint-cli2 is not supported
		".markdownlint-cli2.mjs",
		// no plugins for secretlint
		".secretlintrc.cjs",
	],
	ignoreDependencies: [
		"@secretlint/secretlint-rule-preset-recommend",
		"@secretlint/types",
		"@testing-library/react",
		"@testing-library/user-event",
	],
} as KnipConfig;
