'use strict';

// require sequelize
const Sequelize = require("sequelize");

// defines, initializes User model
module.exports = sequelize => {
    class User extends Sequelize.Model {}
    User.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        },
        emailAddress: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        }
    }, { sequelize });

    User.associate = (models) => {
        //Tells Sequelize a user (source) can be associated with many courses (target), adds a userId foreign key column to the Courses table 
        User.hasMany(models.Course);
    };

    return User;
}