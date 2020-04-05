DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department(
  id INTEGER AUTO_INCREMENT NOT NULL,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INTEGER AUTO_INCREMENT NOT NULL,
  title VARCHAR(30),
  salary decimal,
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id)
	REFERENCES department(id)
);

CREATE TABLE employee(
  id INTEGER AUTO_INCREMENT NOT NULL,
  firstname VARCHAR(30),
  lastname VARCHAR(30),
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id)
	REFERENCES role(id),
  FOREIGN KEY (manager_id) 
	REFERENCES manager(id)
	ON DELETE SET NULL
);