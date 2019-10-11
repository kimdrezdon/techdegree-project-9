"use strict";

// require sequelize
const Sequelize = require("sequelize");

// defines, initializes Course model
module.exports = sequelize => {
  class Course extends Sequelize.Model {}
  Course.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            // custom error message for NULL values (thrown by allowNull: false)
            msg: "Please provide a Title"
          },
          notEmpty: {
            // custom error message for empty strings (thrown by STRING data type)
            msg: "Please provide a Title"
          }
        }
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            // custom error message for NULL values (thrown by allowNull: false)
            msg: "Please provide a Description"
          },
          notEmpty: {
            // custom error message for empty strings (thrown by STRING data type)
            msg: "Please provide a Description"
          }
        }
      },
      estimatedTime: {
        type: Sequelize.STRING,
        allowNull: true
      },
      materialsNeeded: {
        type: Sequelize.STRING,
        allowNull: true
      }
    },
    { sequelize }
  );

  Course.associate = models => {
    //Tells Sequelize a course (source) can be associated with only one user (target)
    Course.belongsTo(models.User, {
      foreignKey: {
        fieldName: "userId"
      }
    });
  };

  return Course;
};
