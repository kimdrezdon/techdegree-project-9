//Require Express
const express = require('express');

//Require Express router
const router = express.Router();

//Import tool to hash user passwords
const bcryptjs = require('bcryptjs');

//Import tool to parse the authorization header
const auth = require('basic-auth');

//Import express-validator 
const { check, validationResult } = require('express-validator');

//User and Course models
const { User, Course } = require("./db").models;

//Middleware to handle errors without using try/catch blocks in every route. Takes in a callback function, wraps it in a try/catch block, and passes errors to the global error handling middleware
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb (req, res, next);
        } catch (err) {
            next(err);
        }
    }
}

//Custom authentication middleware function
const authenticateUser = async (req, res, next) => {
    let message = null;

    // Parse the user's credentials from the Authorization header. will be set to an object containing the user's key and secret
    const credentials = auth(req);
  
    // If the user's credentials are available and successfully parsed from the Authorization header...
    if (credentials) {
        // Attempt to retrieve the user from the database by their username (emailAddress)
        const user = await User.findOne({
            where: { emailAddress: credentials.name }
        });
    
        // If a user was successfully retrieved from the data store...
        if (user) {
            // Use the bcryptjs npm package to compare the user's password (from the Authorization header) to the user's password that was retrieved from the database.
            const authenticated = bcryptjs.compareSync(credentials.pass, user.password);

            // If the passwords match...
            if (authenticated) {
                console.log(`Authentication successful for username: ${user.emailAddress}`);
                // Then store the retrieved user object on the request object so any middleware functions that follow this middleware function will have access to the user's information.
                req.currentUser = user;
            } else {
                message = `Authentication failure for username: ${user.username}`;
            }
        } else {
            message = `User not found for username: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }
  
    // If user authentication failed...
    if (message) {
        console.warn(message);

        // Return a response with a 401 Unauthorized HTTP status code. Message is 'access denied' so as not to provide the user a hint to what went wrong. 
        res.status(401).json({ message: 'Access Denied' });
    } else {
        // Or if user authentication succeeded... Call the next() method.
        next();
    }
};


//Custom validators for user creation
const firstNameValidator = check('firstName')
    .exists({
        checkNull: true,
        checkFalsy: true
    })
    .withMessage('Please provide a value for "firstName"');

const lastNameValidator = check('lastName')
    .exists({
        checkNull: true,
        checkFalsy: true
    })
    .withMessage('Please provide a value for "lastName"');

const emailValidator = check('emailAddress')
    .exists({
        checkNull: true,
        checkFalsy: true
    })
    .withMessage('Please provide a value for "emailAddress"');

const passwordValidator = check('password')
    .exists({
        checkNull: true,
        checkFalsy: true
    })
    .withMessage('Please provide a value for "password"');


//Custom validators for course creation
const titleValidator = check('title')
    .exists({
        checkNull: true,
        checkFalsy: true
    })
    .withMessage('Please provide a value for "title"');

const descriptionValidator = check('description')
    .exists({
        checkNull: true,
        checkFalsy: true
    })
    .withMessage('Please provide a value for "description"');


//Send a GET request to /users to return the currently authenticated user (200)
//needs to call custom authentication middleware first
router.get('/users', authenticateUser, asyncHandler( async (req, res) => {
    const user = req.currentUser;
    res.status(200).json({
        name: `${user.firstName} ${user.lastName}`,
        username: user.emailAddress
    });
}));

//Send a POST request to /users to create a user, set the Location header to '/' and return no content (201)
//needs to validate that the request body contains these required values and return validation errors when necessary: firstName, lastName, emailAddress, password
router.post('/users', firstNameValidator, lastNameValidator, emailValidator, passwordValidator, asyncHandler( async (req, res) => {
    //Attempt to get the validation result from the Request object
    const errors = validationResult(req);

    // If there are validation errors...
    if (!errors.isEmpty()) {
        // Use the Array `map()` method to get a list of error messages.
        const errorMessages = errors.array().map(error => error.msg);

        // Return the validation errors to the client.
        return res.status(400).json({ errors: errorMessages });
    }
    
    let user;
    try {
        user = req.body;
        user.password = bcryptjs.hashSync(user.password);
        await User.create(user);
        res.status(201).set('Location', '/').end();
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            const errorMessages = error.errors.map(error => error.message);
            res.status(400).json({ errors: errorMessages });
        } else {
            throw error;
        }
    }
}));

//Send a GET request to /courses to return a list of courses, including the user that owns each course (200)
router.get('/courses', asyncHandler( async (req, res) => {
    const courses = await Course.findAll({      
        //options object literal to configure the query
        include: [{
            model: User,
            attributes: [ 'firstName', 'lastName' ]
        }] //list of associations to load
    });
    res.status(200).json(courses);
}));

//Send a GET request to /courses/:id to return the course, including the user that owns the course, for the provided course ID (200)
router.get('/courses/:id', asyncHandler( async (req, res) => {
    const course = await Course.findByPk(req.params.id, {        
        //options object literal to configure the query
        include: [{
            model: User,
            attributes: [ 'firstName', 'lastName' ]
        }]
    });
    res.status(200).json(course);
}));

//Send a POST request to /courses to create a course, set the Location header to the URI for the course, and return no content (201)
//needs to validate that the request body contains these required values and return validation errors when necessary: title, description
router.post('/courses', authenticateUser, titleValidator, descriptionValidator, asyncHandler( async (req, res) => {
    //Attempt to get the validation result from the Request object
    const errors = validationResult(req);

    // If there are validation errors...
    if (!errors.isEmpty()) {
        // Use the Array `map()` method to get a list of error messages.
        const errorMessages = errors.array().map(error => error.msg);

        // Return the validation errors to the client.
        return res.status(400).json({ errors: errorMessages });
    }
    
    const user = req.currentUser;
    let course;
    try {
        req.body.UserId = user.dataValues.id;
        course = await Course.create(req.body);
        const courseId = course.dataValues.id;
        res.status(201).set('Location', `/courses/${courseId}`).end();
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            const errorMessages = error.errors.map(error => error.message);
            res.status(400).json({ errors: errorMessages });
        } else {
            throw error;
        }
    }
}));

//Send a PUT request to /courses/:id to update a course and return no content (204)
//needs to validate that the request body contains these required values and return validation errors when necessary: title, description
router.put('/courses/:id', authenticateUser, titleValidator, descriptionValidator, asyncHandler( async (req, res) => {
    //Attempt to get the validation result from the Request object
    const errors = validationResult(req);

    // If there are validation errors...
    if (!errors.isEmpty()) {
        // Use the Array `map()` method to get a list of error messages.
        const errorMessages = errors.array().map(error => error.msg);

        // Return the validation errors to the client.
        return res.status(400).json({ errors: errorMessages });
    }
    
    const user = req.currentUser;
    let course;
    try {
        course = await Course.findByPk(req.params.id);
        req.body.id = req.params.id;
        if (course) {
            if (course.UserId === user.dataValues.id) {
                req.body.UserId = user.dataValues.id;
                await course.update(req.body);
                res.status(204).end();
            } else {
                res.status(401).json({ message: 'Access Denied' });
            }
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            const errorMessages = error.errors.map(error => error.message);
            res.status(400).json({ errors: errorMessages });
        } else {
            throw error;
        }
    }
}));

//Send a DELETE request to /courses/:id to delete a course and return no content
router.delete('/courses/:id', asyncHandler( async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    await course.destroy();
    res.status(204).end();
}));

//Export the router
module.exports = router;