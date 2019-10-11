//Require express
const express = require("express");
const app = express();

//Setup morgan
const morgan = require("morgan");
app.use(morgan("dev"));

// variable to enable global error logging
const enableGlobalErrorLogging =
  process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true";

// imports the database from index.js
const db = require("./db");

//Import the routes.js file
const routes = require("./routes");

//Express middleware parses incoming JSON from the client and makes it available to our Express server via req.body
app.use(express.json());

//test the connection to the database
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
})();

// sync all tables. force:true drops the table that exists each time the app is started and recreates it from the model definition
db.sequelize.sync();

//Use the routes.js file when the requested route starts with /api/
app.use("/api", routes);

// setup a friendly greeting for the root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the REST API project!"
  });
});

//Route for non-existent routes.
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found"
  });
});

//Global error handling middleware
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// set our port
app.set("port", process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get("port"), () => {
  console.log(
    `Express server is listening on localhost:${server.address().port}`
  );
});
