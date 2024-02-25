// @ts-check

import { config } from "dotenv";

/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  _comment:
    "This config was generated using 'stryker init'. Please take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information.",
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress"],
  testRunner: "mocha",
  mutate: ["src/Controllers/*.js"],
  testRunner_comment:
    "Take a look at https://stryker-mutator.io/docs/stryker-js/mocha-runner for information about the mocha plugin.",
  coverageAnalysis: "perTest",
  mochaOptions: {
    spec: ["src/test/**/*.test.js"],
    config: ".mocharc.cjs",
    ["no-package"]: true,
    ["no-opts"]: true,
    ui: "bdd",
    "async-only": false,
    grep: ".*",
  },
};
export default config;
