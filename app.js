const express = require('express');
const db = require('./models');
const bodyParser = require('body-parser');
const routes = require('./routes');
const passport = require("passport");
const cors = require("cors");
const app = express()
require("dotenv").config();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use("/api/v1", routes);

app.use(passport.initialize())


const port = process.env.PORT
app.listen(port, async () => {
  try {
    await db.sequelize.sync({ force: false });
    console.log('Model has been synced successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  console.log(`App listening at port http://localhost:${port}`);
})

