//Require Express
const express = require('express');

//Require Express router
const router = express.Router();

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

//Send a GET request to /users to READ a list of users
router.get('/users', asyncHandler( async (req, res) => {
    const users = await User.findAll();
    res.json(users);
}))

//Export the router
module.exports = router;