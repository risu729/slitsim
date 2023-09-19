// @ts-check

import organizeImports from "prettier-plugin-organize-imports";

/**
 * @type {import("prettier").Config}
 */
export default {
	// extends config from .editorconfig
	plugins: [organizeImports],
};
