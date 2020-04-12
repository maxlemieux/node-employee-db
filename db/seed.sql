USE employee_db;

# Departments
INSERT INTO department (name) VALUES ('General Management');
INSERT INTO department (name) VALUES ('Sales');
INSERT INTO department (name) VALUES ('Operations');

# Roles
INSERT INTO role (title, department_id, salary) VALUES ('CEO', 1, 250000);
INSERT INTO role (title, department_id, salary) VALUES ('VP Sales', 2, 150000);
INSERT INTO role (title, department_id, salary) VALUES ('VP Operations', 3, 150000);
INSERT INTO role (title, department_id, salary) VALUES ('Chief Bottle Washer', 3, 50000);
INSERT INTO role (title, department_id, salary) VALUES ('Novice Bottle Washer', 3, 25000);

# Employees
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ('Wilma', 'Flintstone', null, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ('Fred', 'Flintstone', 1, 2);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ('Betty', 'Rubble', 1, 3);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ('Barney', 'Rubble', 3, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ('Dino', 'Flintstone', 3, 5);