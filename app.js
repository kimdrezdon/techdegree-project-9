//Require express
const express = require("express");
const app = express();

//Setup morgan
const morgan = require('morgan');
app.use(morgan('dev'));

// imports the database from index.js
const db = require("./db");

// destructures the Book model imported from db.models
const { User, Course } = db.models;

//Import the routes.js file
const routes = require('./routes');

//Express middleware parses incoming JSON from the client and makes it available to our Express server via req.body
app.use(express.json());


// sync all tables. force:true drops the table that exists each time the app is started and recreates it from the model definition
db.sequelize.sync();

//Use the routes.js file when the requested route starts with /api/
app.use('/api', routes);

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the REST API project!',
    });
});

//Route for non-existent routes. Sends error message to error handling middleware
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Global error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    })
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on localhost:${server.address().port}`);
});