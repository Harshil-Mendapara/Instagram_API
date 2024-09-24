require("dotenv").config();

const dbConfig =
{
  "development": {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    databaseName: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT,
  },
  "test": {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    databaseName: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT,
  },
  "production": {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    databaseName: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT,
  }
}


module.exports = dbConfig
