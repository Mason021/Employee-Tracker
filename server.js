// List of the dependencies here.
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const util = require('util');

// Create the connection to MySQL WorkBench
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
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
                'Departments',
                'Employees',
                'Roles of Employees',
                'Add Employees',
                'Add Departments',
                'Add Roles',
                'Update Employee Role',
                'Exit'
            ]
        });
        switch (answer.action) {
            case 'Departments':
                departmentOutlook();
                break;

            case 'Employees':
                employeeOutlook();
                break;

            case 'Roles of Employees':
                roleOutlook();
                break;

            case 'Add Employees':
                employeeAddition();
                break

            case 'Add Departments':
                departmentAddition();
                break

            case 'Add Roles':
                roleAddition();
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

// Selection to view all of the departments.
const departmentOutlook = async () => {
    console.log('Department Outlook');
    try {
        let query = 'SELECT * FROM department';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let departmentInfoArray = [];
            res.forEach(department => departmentInfoArray.push(department));
            console.table(departmentInfoArray);
            commenceInfoGather();
        });
    } catch (err) {
        console.log(err);
        commenceInfoGather();
    };
}

// Selection to view all of the employees.
const employeeOutlook = async () => {
    console.log('Employee Outlook');
    try {
        let query = 'SELECT * FROM employee';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let employeeInfoArray = [];
            res.forEach(employee => employeeInfoArray.push(employee));
            console.table(employeeInfoArray);
            commenceInfoGather();
        });
    } catch (err) {
        console.log(err);
        commenceInfoGather();
    };
}

// Selection to view all of the roles.
const roleOutlook = async () => {
    console.log('Role Outlook');
    try {
        let query = 'SELECT * FROM roles';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let roleInfoArray = [];
            res.forEach(roles => roleInfoArray.push(roles));
            console.table(roleInfoArray);
            commenceInfoGather();
        });
    } catch (err) {
        console.log(err);
        commenceInfoGather();
    };
}

// Selection to add a new employee.
const employeeAddition = async () => {
    try {
        console.log('Employee Add');

        let roles = await connection.query("SELECT * FROM roles");

        let managers = await connection.query("SELECT * FROM employee");

        let answer = await inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'Employee first name'
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'Employee last name?'
            },
            {
                name: 'employeeRoleId',
                type: 'list',
                choices: roles.map((roles) => {
                    return {
                        name: roles.title,
                        value: roles.id
                    }
                }),
                message: "Employee's role id"
            },
            {
                name: 'employeesManagerID',
                type: 'list',
                choices: managers.map((manager) => {
                    return {
                        name: manager.first_name + " " + manager.last_name,
                        value: manager.id
                    }
                }),
                message: "Employee's Manager Id"
            }
        ])

        let result = await connection.query("INSERT INTO employee SET ?", {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: (answer.employeeRoleId),
            manager_id: (answer.employeesManagerID)
        });

        console.log(`${answer.firstName} ${answer.lastName} added successfully.\n`);
        commenceInfoGather();

    } catch (err) {
        console.log(err);
        commenceInfoGather();
    };
}

// Add a new department.
const departmentAddition = async () => {
    try {
        console.log('Department Add');

        let answer = await inquirer.prompt([
            {
                name: 'departmentName',
                type: 'input',
                message: 'Name of new department'
            }
        ]);

        let result = await connection.query("INSERT INTO department SET ?", {
            department_name: answer.departmentName
        });

        console.log(`${answer.departmentName} added successfully to departments.\n`)
        commenceInfoGather();

    } catch (err) {
        console.log(err);
        commenceInfoGather();
    };
}

// Add a new role.
const roleAddition = async () => {
    try {
        console.log('Role Add');

        let departments = await connection.query("SELECT * FROM department")

        let answer = await inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Name of new role'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Salary this role provides'
            },
            {
                name: 'departmentId',
                type: 'list',
                choices: departments.map((departmentId) => {
                    return {
                        name: departmentId.department_name,
                        value: departmentId.id
                    }
                }),
                message: 'What department ID is this role associated with?',
            }
        ]);
        
        let chosenDepartment;
        for (i = 0; i < departments.length; i++) {
            if(departments[i].department_id === answer.choice) {
                chosenDepartment = departments[i];
            };
        }
        let result = await connection.query("INSERT INTO roles SET ?", {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.departmentId
        })

        console.log(`${answer.title} role added successfully.\n`)
        commenceInfoGather();

    } catch (err) {
        console.log(err);
        commenceInfoGather();
    };
}

// Update a role for an employee.
const employeeUpdate = async () => {
    try {
        console.log('Employee Update');
        
        let employees = await connection.query("SELECT * FROM employee");

        let employeeSelection = await inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                choices: employees.map((employeeName) => {
                    return {
                        name: employeeName.first_name + " " + employeeName.last_name,
                        value: employeeName.id
                    }
                }),
                message: 'Choose an employee to update.'
            }
        ]);

        let roles = await connection.query("SELECT * FROM roles");

        let roleSelection = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: roles.map((roleName) => {
                    return {
                        name: roleName.title,
                        value: roleName.id
                    }
                }),
                message: 'Select update for employees role.'
            }
        ]);

        let result = await connection.query("UPDATE employee SET ? WHERE ?", [{ role_id: roleSelection.roles }, { id: employeeSelection.employee }]);

        console.log(`Role was successfully updated.\n`);
        commenceInfoGather();

    } catch (err) {
        console.log(err);
        commenceInfoGather();
    };
}