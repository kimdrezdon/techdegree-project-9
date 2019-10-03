// require sequelize
const Sequelize = require("sequelize");

// instantiate sequelize and configure it
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "courses.db"
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to the database!');
    } catch (error) {
        console.error('Error connecting to the database: ', error);
    }
}) ();