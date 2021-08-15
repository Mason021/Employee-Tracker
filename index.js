// List of the dependencies here.
const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const util = require('util');

// Create the connection to MySQL WorkBench
let connection = mysql.createConnection({
    host: 'localhost',
    port: 3302,
    user: 'root',
    password: '',
    database: 'employee_DB'
});

connection.query = util.promisify(connection.query);

// Begin application after connection is set.
connection.connect(function (err) {
    if (err) throw err;
    commenceInfoGather();
})

// User welcome message.
console.table(
    "\n------------ EMPLOYEE TRACKER ------------\n"
)

// User is presented with action question to figure out what their next step is.
const commenceInfoGather = async () => {
    try {
        let answer = await inquirer.prompt({
            name: 'action',
            type: 'list',
            message: 'Please select what you would like to do next from the options below',
            choices: [
                'View Departments',
                'employees',
                'View Roles',
                'Add Employees',
                'Add Departments',
                'Add Roles',
                'Update Employee Role',
                'Exit'
            ]
        });
        switch (answer.action) {
            case 'View Departments':
                departmentView();
                break;

            case 'employees':
                employeeView();
                break;

            case 'View Roles':
                roleView();
                break;

            case 'Add Employees':
                employeeAdd();
                break

            case 'Add Departments':
                departmentAdd();
                break

            case 'Add Roles':
                roleAdd();
                break

            case 'Update Employee Role':
                employeeUpdate();
                break

            case 'Exit':
                connection.end();
                break;
        };
    } catch (err) {
        console.log(err);
        commenceInfoGather();
    };
}

