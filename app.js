// require sequelize
const Sequelize = require("sequelize");

// instantiate sequelize and configure it
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "courses.db"
});

// defines, initializes User model
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

// defines, initializes Course model
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


//Tells Sequelize a user (source) can be associated with many courses (target), adds a userId foreign key column to the Courses table 
User.hasMany(Course);


//Tells Sequelize a course (source) can be associated with only one user (target)
Course.belongsTo(User);

//Creates records
(async () => {
    await sequelize.sync({ force: true });
    try {
        const user1 = await User.create({
            firstName: 'Kim',
            lastName: 'Drezdon',
            emailAddress: 'kimdrezdon@gmail.com',
            password: 'testing123'
        });
        await Course.create({
            title: 'Intro to Art History',
            description: 'Blah blah blah',
            estimatedTime: '1 hour',
            materialsNeeded: 'Pen and notebook',
            UserId: user1.id
        })
    } catch (error) {
        console.error('Error creating a record: ', error);
    }
}) ();