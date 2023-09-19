import type { UserConfig } from "@commitlint/types";

const commitlintConfig: UserConfig = {
	extends: ["@commitlint/config-conventional"],
};

/* eslint-disable-next-line unicorn/prefer-module --
 * cannot export as an ESM module due to a bug of ts-node
 * https://github.com/conventional-changelog/commitlint/issues/3251
 */
module.exports = commitlintConfig;
