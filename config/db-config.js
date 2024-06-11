require("dotenv").config();

const dbConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  databaseName: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT,
};

module.exports = dbConfig

