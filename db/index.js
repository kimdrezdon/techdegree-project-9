// require sequelize
const Sequelize = require("sequelize");

// instantiate sequelize and configure it
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "fsjstd-restapi.db",
  logging: false //disable logging
});

// create the database object
const db = {
  sequelize,
  Sequelize,
  models: {}
};

// requires or loads the User model defined in the user.js file
db.models.User = require("./models/user.js")(sequelize);

// requires or loads the Course model defined in the course.js file
db.models.Course = require("./models/course.js")(sequelize);

// If available, call method to create associations.
Object.keys(db.models).forEach(modelName => {
  if (db.models[modelName].associate) {
    db.models[modelName].associate(db.models);
  }
});

// exports the database object
module.exports = db;
