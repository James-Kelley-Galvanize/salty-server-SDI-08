const knex = require("knex");

const knexConfigs = require("../knexfile");

const currentConfig = knexConfigs[process.env.NODE_ENV || "development"];

const dbConnection = knex(currentConfig);

module.exports = dbConnection;
