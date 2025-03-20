module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ["vue", "cypress", "jest"],
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended"],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false,
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    "vue/require-prop-types": "warn",
    strict: "off",
  },
  overrides: [
    {
      files: ["tests/integration/**/*.js", "tests/e2e/**/*.js"],
      env: {
        mocha: true,
        "cypress/globals": true,
      },
      extends: ["plugin:cypress/recommended"],
      plugins: ["cypress"],
      globals: {
        cy: "readonly",
        Cypress: "readonly",
        describe: "readonly",
        it: "readonly",
        beforeEach: "readonly",
        expect: "readonly",
      },
    },
    {
      files: ["tests/unit/**/*.spec.js"],
      env: {
        jest: true,
      },
      extends: ["plugin:jest/recommended"],
      plugins: ["jest"],
    },
  ],
};
