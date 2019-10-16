# REST API

This project uses Sequelize, Express, Node.js and JavaScript to build a REST API that manages a database of course and users. 

A list of courses or a single course can be viewed without authorization.
Courses can be created by an authorized user.
Courses can only be updated and deleted by the authorized course owner.
Error messages will be displayed if the title or description fields are empty.

Users can be created.
The current authorized user can be returned.
Error messages will be displayed if the name, email address or password fields are empty.
Passwords are hashed using bcrypt.
 
## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.