'use strict';

// require sequelize
const Sequelize = require("sequelize");

// defines, initializes Course model
module.exports = sequelize => {
    class Course extends Sequelize.Model {}
    Course.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        estimatedTime: {
            type: Sequelize.STRING,
            allowNull: true
        },
        materialsNeeded: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, { sequelize });

    Course.associate = (models) => {
        //Tells Sequelize a course (source) can be associated with only one user (target)
        Course.belongsTo(models.User);
    };

    return Course;
}
