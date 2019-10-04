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

//remove the async await and try catch blocks after app is working
(async () => {
    // sync all tables. force:true drops the table that exists each time the app is started and recreates it from the model definition
    await db.sequelize.sync({ force: true });
    try {
        //create records for testing purposes
        const user1 = await User.create({
            firstName: 'Kim',
            lastName: 'Drezdon',
            emailAddress: 'kimdrezdon@gmail.com',
            password: 'testing123'
        });
        const user2 = await User.create({
            firstName: 'Dylan',
            lastName: 'Zocchi',
            emailAddress: 'dylanzocchi@gmail.com',
            password: 'testing1234'
        });
        await Course.create({
            title: 'Intro to Art History',
            description: 'Blah blah blah',
            estimatedTime: '1 hour',
            materialsNeeded: 'Pen and notebook',
            UserId: user1.id
        });
        await Course.create({
            title: 'Astronomy',
            description: 'Blahs blahs blahs',
            estimatedTime: '2 hour',
            materialsNeeded: 'Pencil',
            UserId: user2.id
        });
        await Course.create({
            title: 'Calculus',
            description: 'Blahdy blah',
            estimatedTime: '3 hour',
            materialsNeeded: 'Calculator',
            UserId: user1.id
        });
    } catch (error) {
        console.error('Error creating a record: ', error);
    }
}) ();

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