const dotenv = require('dotenv')
const dotenvResult = dotenv.config()
if (dotenvResult.error) throw dotenvResult.error;

const chalk = require('chalk');
const figlet = require('figlet');
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "employee_db"
});

/* Validation function to make sure we don't accept empty inputs */
function isEmpty(input) {
	return input.length !== 0;
}

/* https://stackoverflow.com/questions/9006988/node-js-on-windows-how-to-clear-console
    Escape sequence to clear the screen on the console. 
    Strict mode complains about this octal literal. */
const clearOutput = () => {
  process.stdout.write('\033c');
}

/* Show a header when the app is launched */
const displayBrand = () => {
  console.log(chalk.yellow(figlet.textSync('employee-db', { horizontalLayout: 'full' })));
}

/* View All Employees */
function viewEmployees() {
  connection.query( 'SELECT * FROM employee', (err, rows) => {
    if (rows != undefined) {
      console.table(rows);
    } else {
      console.log('No employees found, please add an employee first.');
    }
    showMenu();
  })
}
//// View All Employees by Department
//// View All Employees by Manager

/* Add Employee */
function addEmployee() {
  connection.query('SELECT id, title FROM role', (err, roles) => {
    if (err) throw Error(err);
    /* Get an array of all the role titles to use for choices */
    const rolesTitles = roles.map(role => role.title);
    /* Get a role ID from the role Name - this would probably be better as a getter on a class */
    function roleId(roles, roleTitle) {
      for (let i=0; i<roles.length; i++) {
        if (roles[i].title === roleTitle) {
          return roles[i].id;
        }
      }
    }
    connection.query('SELECT id, first_name, last_name FROM employee', (err, employees) => {
      if (err) throw Error(err);
      /* Get an array of all the employee names to use for manager choices */
      const employeeNames = employees.map(employee => `${employee.first_name} ${employee.last_name}`);
      /* Get a employee ID from the employee Name - this would probably be better as a getter on a class */
      function employeeId(employees, employeeName) {
        if (employeeName === 'None') {
          return null;
        }
        for (let i=0; i<employees.length; i++) {
          if (`${employees[i].first_name} ${employees[i].last_name}` === employeeName) {
            return employees[i].id;
          }
        }
      }
      /* Build and save a new employee record */
      inquirer
        .prompt([
          {
            name: "first_name",
            type: "input",
            message: `What is the employee's first name?`
          },
          {
            name: "last_name",
            type: "input",
            message: `What is the employee's last name?`
          },
          {
            name: "role",
            type: "list",
            choices: rolesTitles
          },
          {
            name: "manager",
            type: "list",
            choices: [ ...employeeNames, 'None']
          }
        ])
        .then(answers => {
          const employeeArray = [
            {
              first_name: answers.first_name, 
              last_name: answers.last_name, 
              role_id: roleId(roles, answers.role),
              manager_id: employeeId(employees, answers.manager)
            }
          ];
          connection.query('INSERT INTO employee SET ?', employeeArray, (err, res) => {
            if (err) throw err;
            showMenu();
          })
        })
    })
  })
}

//// Remove Employee

// Update Employee Role
function updateEmployeeRole() {
  connection.query('SELECT id, title FROM role', (err, roles) => {
    if (err) throw Error(err);
    /* Get an array of all the role titles to use for choices */
    const rolesTitles = roles.map(role => role.title);
    /* Get a role ID from the role Name - this would probably be better as a getter on a class */
    function roleId(roles, roleTitle) {
      for (let i=0; i<roles.length; i++) {
        if (roles[i].title === roleTitle) {
          return roles[i].id;
        }
      }
    }
    connection.query('SELECT id, first_name, last_name FROM employee', (err, employees) => {
      if (err) throw Error(err);
      /* Get an array of all the employee names */
      const employeeNames = employees.map(employee => `${employee.first_name} ${employee.last_name}`);
      /* Get a employee ID from the employee Name - this would probably be better as a getter on a class */
      function employeeId(employees, employeeName) {
        for (let i=0; i<employees.length; i++) {
          if (`${employees[i].first_name} ${employees[i].last_name}` === employeeName) {
            return employees[i].id;
          }
        }
      }
      /* Build and save a new employee record */
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: `Change the role for which employee?`,
            choices: employeeNames,
          },
          {
            name: "role",
            type: "list",
            message: `What role would you like to set for this employee?`,
            choices: rolesTitles
          },
        ])
        .then(answers => {
          const employeeArray = [
            {
              role_id: roleId(roles, answers.role),
            }
          ];
          connection.query(`UPDATE employee SET ? WHERE id=${employeeId(employees, answers.employee)}`, employeeArray, (err, res) => {
            if (err) throw err;
            showMenu();
          })
        })
    })
  })
}


//// Update Employee Manager

// View All Roles
function viewRoles() {
  connection.query( 'SELECT * FROM role', (err, rows) => {
    if (rows != undefined) {
      console.table(rows);
    } else {
      console.log('No roles found, please add a role first.');
    }
    showMenu();
  })
}

// Add Role
function addRole() {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: `What is the title for this role?`
      },
      {
        name: "salary",
        type: "input",
        message: `What is the salary for this role?`
      }
    ])
    .then(answers => {
      const roleArray = [
        {
          title: answers.title, 
          salary: answers.salary, 
        }
      ];
      connection.query('INSERT INTO role SET ?', roleArray, (err, res) => {
        if (err) throw err;
        showMenu();
      })
    })
}
//// Remove Role
// View Departments
function viewDepartments() {
  connection.query( 'SELECT * FROM department', (err, rows) => {
    if (rows != undefined) {
      console.table(rows);
    } else {
      console.log('No departments found, you need to add some first');
    }
    showMenu();
  })
}

// Add Department
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: `What is the name of this department?`
      }
    ])
    .then(answers => {
      const departmentArray = [
        {
          name: answers.name, 
        }
      ];
      connection.query('INSERT INTO department SET ?', departmentArray, (err, res) => {
        if (err) throw err;
        showMenu();
      })
    })
}

//// Remove Department

/* Show the main menu */
const showMenu = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'Add Employee',
        'Update Employee Role',
        'View All Roles',
        'Add Role',
        'View Departments',
        'Add Department',
        'exit'
      ]
    }).then(answer => {
      switch(answer.action) {
        case 'View All Employees':
          viewEmployees();
          break;
        case 'Add Employee':
          addEmployee();
          break;
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        case 'View All Roles':
          viewRoles();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'View Departments':
          viewDepartments();
          break;
        case 'Add Department':
          addDepartment();
          break;
        default:
          connection.end();
          break;
      }
    })
};

connection.connect(err => {
  if (err) throw err;
  // console.log(`connected as id ${connection.threadId}`);
  startApp();
});

function startApp() {
  displayBrand();
  showMenu();
}