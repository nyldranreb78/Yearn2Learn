module.exports = {
  plugins: ["cypress"],
  env: {
    mocha: true,
    "cypress/globals": true,
  },
  globals: {
    cy: "readonly",
    Cypress: "readonly",
    describe: "readonly",
    it: "readonly",
    beforeEach: "readonly",
    expect: "readonly",
  },
  rules: {
    strict: "off",
  },
};
