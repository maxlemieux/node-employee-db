/* NPM packages */
const chalk = require('chalk');
const inquirer = require('inquirer');
require('console.table');

/* Local modules */
const connection = require('./config/connection.js');
const util = require('./util/util.js')

/* Database models */
const Department = require('./models/department');
const Role = require('./models/role');
const Employee = require('./models/employee');

/* View All Employees */
function viewEmployees() {
  Employee.viewAll()
    .then(data => {
      if (data != undefined) {
        console.table(data)
      } else {
        console.log('No employees found, please add an employee first.');
      };
    }).catch(err => {
      console.log(err);
    })
    .then(() => {
      showMenu();
    });
};

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
        };
      };
    };
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
            message: "What is the employee's first name?",
            validate: util.isEmpty
          },
          {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name?",
            validate: util.isEmpty
          },
          {
            name: "role",
            type: "list",
            choices: rolesTitles,
            validate: util.isEmpty
          },
          {
            name: "manager",
            type: "list",
            choices: [ ...employeeNames, 'None'],
            validate: util.isEmpty,
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
            console.log(chalk.green(`Added new employee ${answers.first_name} ${answers.last_name} with role "${answers.role}" and manager ${answers.manager}`));
            showMenu();
          });
        });
    });
  });
};




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
        };
      };
    };
    connection.query('SELECT id, first_name, last_name FROM employee', (err, employees) => {
      if (err) throw Error(err);
      /* Get an array of all the employee names */
      const employeeNames = employees.map(employee => `${employee.first_name} ${employee.last_name}`);
      /* Get a employee ID from the employee Name - this would probably be better as a getter on a class */
      function employeeId(employees, employeeName) {
        for (let i=0; i<employees.length; i++) {
          if (`${employees[i].first_name} ${employees[i].last_name}` === employeeName) {
            return employees[i].id;
          };
        };
      };
      /* Build and save a new employee record */
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: `Change the role for which employee?`,
            choices: employeeNames,
            validate: util.isEmpty
          },
          {
            name: "role",
            type: "list",
            message: `What role would you like to set for this employee?`,
            choices: rolesTitles,
            validate: util.isEmpty
          },
        ])
        .then(answers => {
          const newEmployeeObj = {
            role_id: roleId(roles, answers.role),
          };
          connection.query(`UPDATE employee SET ? WHERE id=${employeeId(employees, answers.employee)}`, newEmployeeObj, (err, res) => {
            if (err) throw err;
            console.log(chalk.green(`Updated role to  "${answers.role}" for employee ${answers.employee}`));
            showMenu();
          });
        });
    });
  });
};


//// Update Employee Manager

// View All Roles
function viewRoles() {
  connection.query( 'SELECT * FROM role', (err, data) => {
    if (data != undefined) {
      console.table(data);
    } else {
      console.log('No roles found, please add a role first.');
    };
    showMenu();
  });
};

// Add Role
function addRole() {
  inquirer.prompt(
    [
      {
        name: "title",
        type: "input",
        message: "What is the title for this role?",
        validate: util.isEmpty
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary for this role?",
        validate: util.isPositiveNumber
      }
    ]
  ).then(answers => {
    const newRoleObj = {
        title: answers.title, 
        salary: answers.salary, 
    };
    Role.add(newRoleObj)
      .then(console.log(chalk.green(`Added new role "${newRoleObj.title}" with salary ${newRoleObj.salary}`)));
    showMenu();
  });
};

//// Remove Role

// View Departments
function viewDepartments() {
  Department.viewAll()
    .then(data => {
      if (data != undefined) {
            console.table(data);
          } else {
            console.log('No departments found, you need to add some first');
          }
    })
    .catch(err => {
      console.log(err);
    })
    .then(() => {
      showMenu();
    });
};

// Add Department
function addDepartment() {
  inquirer.prompt(
    {
      name: "name",
      type: "input",
      message: "What is the name of this department?",
      validate: util.isEmpty
    }
  ).then(answers => {
    const newDepartmentObj = {
      name: answers.name, 
    };
    Department.add(newDepartmentObj);
    console.log(chalk.green(`Added new department "${answers.name}"`));
    showMenu();
  });
};

//// Remove Department
function removeDepartment() {
  connection.query('SELECT id, name FROM department', (err, rows) => {
    if (err) throw Error(err);
    /* Get an array of all the role titles to use for choices */
    const departmentNames = rows.map(department => department.name);
    /* Get a department ID from the department Name - this would probably be better as a getter on a class */
    function departmentId(rows, departmentName) {
      for (let i=0; i<rows.length; i++) {
        if (rows[i].name === departmentName) {
          return rows[i].id;
        };
      };
    };
    inquirer.prompt(
      {
        name: "name",
        type: "list",
        message: "Remove which department?",
        choices: departmentNames,
        validate: util.isEmpty
      }
    ).then(answers => {
      const departmentId = departmentId(answers.name);
      Department.remove(departmentId);
      console.log(chalk.green(`Removed department "${answers.name}"`));
      showMenu();
    });
  })
};


/* Show the main menu */
function showMenu() {
  inquirer.prompt({
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
      'Remove Department',
      'Exit'
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
      case 'Remove Department':
        removeDepartment();
        break;
      default:
        connection.end();
        break;
    };
  });
};



function startApp() {
  util.displayBrand('employee-db');
  showMenu();
};

startApp();
