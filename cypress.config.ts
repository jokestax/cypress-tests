const { defineConfig } = require("cypress");
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 2000,
    viewportHeight: 900,
    env:{
      user_name: process.env.USERNAME,
      password: process.env.PASSWORD,
      domain_name: process.env.DOMAIN
    }

  },
});
