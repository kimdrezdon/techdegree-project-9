"use strict";

// require sequelize
const Sequelize = require("sequelize");

// defines, initializes User model
module.exports = sequelize => {
  class User extends Sequelize.Model {}
  User.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            // custom error message for NULL values (thrown by allowNull: false)
            msg: "Please provide a First Name"
          },
          notEmpty: {
            // custom error message for empty strings (thrown by STRING data type)
            msg: "Please provide a First Name"
          }
        }
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            // custom error message for NULL values (thrown by allowNull: false)
            msg: "Please provide a Last Name"
          },
          notEmpty: {
            // custom error message for empty strings (thrown by STRING data type)
            msg: "Please provide a Last Name"
          }
        }
      },
      emailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            // custom error message for NULL values (thrown by allowNull: false)
            msg: "Please provide an Email Address"
          },
          isEmail: {
            msg: "Please provide a valid Email Address"
          }
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            // custom error message for NULL values (thrown by allowNull: false)
            msg: "Please provide a Password"
          },
          notEmpty: {
            // custom error message for empty strings (thrown by STRING data type)
            msg: "Please provide a Password"
          }
        }
      }
    },
    { sequelize }
  );

  User.associate = models => {
    //Tells Sequelize a user (source) can be associated with many courses (target), adds a userId foreign key column to the Courses table
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: "userId"
      }
    });
  };

  return User;
};
