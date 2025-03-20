const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    specPattern: 'tests/integration/**/*.cy.js',
    baseUrl: 'http://localhost:8080',
    supportFile: false,
  },
});
