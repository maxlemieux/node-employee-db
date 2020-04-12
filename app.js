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
      if (data.length != 0) {
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
function viewEmployeesByDepartment() {
  connection.query('SELECT id, name FROM department', (err, departments) => {
    if (err) throw Error(err);
    /* Get an array of all the department names to use for choices */
    const departmentNames = departments.map(department => department.name);
    /* Get a department ID from the department Name - this would probably be better as a getter on a class */
    function getDepartmentId(departments, departmentName) {
      for (let i=0; i<departments.length; i++) {
        if (departments[i].name === departmentName) {
          return departments[i].id;
        };
      };
    };
    inquirer.prompt({
      name: "department",
      type: "list",
      message: "View employees for what department?",
      choices: departmentNames,
      validate: util.isEmpty
    })
    .then(answers => {
      const departmentId = getDepartmentId(departments, answers.department);
      Employee.viewByDepartment(departmentId)
        .then(data => {
          if (data.length != 0) {
            console.table(data)
          } else {
            console.log(chalk.yellow('No employees found for that department, please choose a different department.'));
          };
        }).catch(err => {
          console.log(err);
        })
        .then(() => {
          showMenu();
        });
    });
  })
};

//// View All Employees by Manager
function viewEmployeesByManager() {
  connection.query('SELECT id, first_name, last_name FROM employee', (err, managers) => {
    if (err) throw Error(err);
    /* Get an array of all the employee names to use for choices */
    const managerNames = managers.map(employee => `${employee.first_name} ${employee.last_name}`);
    /* Get a employee ID from the employee Name - this would probably be better as a getter on a class */
    function getManagerId(managers, managerName) {
      for (let i=0; i<managers.length; i++) {
        if (`${managers[i].first_name} ${managers[i].last_name}` === managerName) {
          return managers[i].id;
        };
      };
    };
    inquirer
      .prompt({
        name: "manager",
        type: "list",
        message: "View employees for what manager?",
        choices: managerNames,
        validate: util.isEmpty
      })
      .then(answers => {
        const managerId = getManagerId(managers, answers.manager);
        Employee.viewByManager(managerId)
          .then(data => {
            if (data.length != 0) {
              console.table(data)
            } else {
              console.log(chalk.yellow('No direct reports found for that employee, please choose a different manager.'));
            };
          }).catch(err => {
            console.log(err);
          })
          .then(() => {
            showMenu();
          });
        });
  })
};

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
      inquirer.prompt([
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
        const newEmployeeObj = {
          first_name: answers.first_name, 
          last_name: answers.last_name, 
          role_id: roleId(roles, answers.role),
          manager_id: employeeId(employees, answers.manager)
        };
        Employee.add(newEmployeeObj)
          .then(() =>{
            console.log(chalk.green(`Added new employee "${answers.first_name} ${answers.last_name}" with role ${answers.role} and manager ${answers.manager}`));
            showMenu();
          });
      });
    });
  });
};

//// Remove Employee
function removeEmployee() {
  connection.query('SELECT id, first_name, last_name FROM employee', (err, rows) => {
    if (err) throw Error(err);
    /* Get an array of all the employee names to use for choices */
    const employeeNames = rows.map(employee => `${employee.first_name} ${employee.last_name}`);
    /* Get a employee ID from the employee Name - this would probably be better as a getter on a class */
    function getEmployeeId(rows, employeeName) {
      for (let i=0; i<rows.length; i++) {
        if (`${rows[i].first_name} ${rows[i].last_name}` === employeeName) {
          return rows[i].id;
        };
      };
    };
    inquirer.prompt({
      name: "name",
      type: "list",
      message: "Remove which employee?",
      choices: employeeNames,
      validate: util.isEmpty
    })
    .then(answers => {
      const employeeId = getEmployeeId(rows, answers.name);
      Employee.remove(employeeId);
      console.log(chalk.yellow(`Removed employee "${answers.name}"`));
      showMenu();
    });
  })
};

// Update Employee Role
function updateEmployeeRole() {
  connection.query('SELECT id, title FROM role', (err, rows) => {
    if (err) throw Error(err);
    /* Get an array of all the role titles to use for choices */
    const rolesTitles = rows.map(role => role.title);
    /* Get a role ID from the role Name - this would probably be better as a getter on a class */
    function roleId(rows, roleTitle) {
      for (let i=0; i<rows.length; i++) {
        if (rows[i].title === roleTitle) {
          return rows[i].id;
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
function updateEmployeeManager() {
  connection.query('SELECT id, first_name, last_name FROM employee', (err, managers) => {
    if (err) throw Error(err);
    /* Get an array of all the employee names to use for choices */
    const managerNames = managers.map(employee => `${employee.first_name} ${employee.last_name}`);
    /* Get a employee ID from the employee Name - this would probably be better as a getter on a class */
    function getManagerId(managers, managerName) {
      for (let i=0; i<managers.length; i++) {
        if (`${managers[i].first_name} ${managers[i].last_name}` === managerName) {
          return managers[i].id;
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
            message: "Change the manager for which employee?",
            choices: employeeNames,
            validate: util.isEmpty
          },
          {
            name: "manager",
            type: "list",
            message: "What manager would you like to set for this employee?",
            choices: managerNames,
            validate: util.isEmpty
          },
        ])
        .then(answers => {
          const newEmployeeObj = {
            manager_id: getManagerId(managers, answers.manager),
          };
          connection.query(`UPDATE employee SET ? WHERE id=${employeeId(employees, answers.employee)}`, newEmployeeObj, (err, res) => {
            if (err) throw err;
            console.log(chalk.green(`Updated manager to  "${answers.manager}" for employee ${answers.employee}`));
            showMenu();
          });
        });
    });
  });
};

// View All Roles
function viewRoles() {
  Role.viewAll()
  .then(data => {
    if (data.length != 0) {
      console.table(data)
    } else {
      console.log('No roles found, please add a role first.');
    };
  }).catch(err => {
    console.log(err);
  })
  .then(() => {
    showMenu();
  });
};

// Add Role
function addRole() {
  connection.query('SELECT id, name FROM department', (err, rows) => {
    if (err) throw Error(err);
    /* Get an array of all the department names to use for choices */
    const departmentNames = rows.map(department => department.name);
    /* Get a department ID from the department Name - this would probably be better as a getter on a class */
    function getDepartmentId(rows, departmentName) {
      for (let i=0; i<rows.length; i++) {
        if (rows[i].name === departmentName) {
          return rows[i].id;
        };
      };
    };
    inquirer.prompt([
      {
        name: "title",
        type: "input",
        message: "What is the title for this role?",
        validate: util.isEmpty
      },
      {
        name: "department",
        type: "list",
        choices: departmentNames,
        message: "What is the department for this role?",
        validate: util.isEmpty
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary for this role?",
        validate: util.isPositiveNumber
      }
    ]).then(answers => {
      const departmentId = getDepartmentId(rows, answers.department);
      const newRoleObj = {
        title: answers.title, 
        salary: answers.salary,
        department_id: departmentId
      };
      Role.add(newRoleObj)
        .then(console.log(chalk.green(`Added new role "${answers.title}" in department "${answers.department}" with salary ${answers.salary}`)));
      showMenu();
    });
  });
};

//// Remove Role
function removeRole() {
  connection.query('SELECT id, title FROM role', (err, rows) => {
    if (err) throw Error(err);
    /* Get an array of all the role titles to use for choices */
    const roleTitles = rows.map(role => role.title);
    /* Get a department ID from the department Name - this would probably be better as a getter on a class */
    function getRoleId(rows, roleTitle) {
      for (let i=0; i<rows.length; i++) {
        if (rows[i].title === roleTitle) {
          return rows[i].id;
        };
      };
    };
    inquirer.prompt({
      name: "title",
      type: "list",
      message: "Remove which role?",
      choices: roleTitles,
      validate: util.isEmpty
    })
    .then(answers => {
      const roleId = getRoleId(rows, answers.title);
      Role.remove(roleId)
        .then(() => {
          console.log(chalk.yellow(`Removed role "${answers.title}"`));
          showMenu();
        })
        .catch(err => {
          if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            console.log(chalk.yellow('Cannot remove that role because it is currently assigned to one or more employees. Please give those employees a new role first.'))
          } else {
            console.log(chalk.yellow('There was an error, please try again.'));
          }
          showMenu();
        });
    })
  })
};

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
  inquirer.prompt({
    name: "name",
    type: "input",
    message: "What is the name of this department?",
    validate: util.isEmpty
  })
  .then(answers => {
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
    /* Get an array of all the department names to use for choices */
    const departmentNames = rows.map(department => department.name);
    /* Get a department ID from the department Name - this would probably be better as a getter on a class */
    function getDepartmentId(rows, departmentName) {
      for (let i=0; i<rows.length; i++) {
        if (rows[i].name === departmentName) {
          return rows[i].id;
        };
      };
    };
    inquirer.prompt({
      name: "name",
      type: "list",
      message: "Remove which department?",
      choices: departmentNames,
      validate: util.isEmpty
    })
    .then(answers => {
      const departmentId = getDepartmentId(answers.name);
      Department.remove(departmentId);
      console.log(chalk.yellow(`Removed department "${answers.name}"`));
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
      'View Employees by Manager',
      'View Employees by Department',
      'Add Employee',
      'Update Employee Role',
      'Update Employee Manager',
      'Remove Employee',
      'View All Roles',
      'Add Role',
      'Remove Role',
      'View Departments',
      'Add Department',
      'Remove Department',
      'Exit'
    ]
  })
  .then(answer => {
    switch(answer.action) {
      case 'View All Employees':
        viewEmployees();
        break;
      case 'View Employees by Manager':
        viewEmployeesByManager();
        break;
      case 'View Employees by Department':
        viewEmployeesByDepartment();
        break;  
      case 'Add Employee':
        addEmployee();
        break;
      case 'Update Employee Role':
        updateEmployeeRole();
        break;
      case 'Update Employee Manager':
        updateEmployeeManager();
        break;
      case 'Remove Employee':
        removeEmployee();
        break;
      case 'View All Roles':
        viewRoles();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'Remove Role':
        removeRole();
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
