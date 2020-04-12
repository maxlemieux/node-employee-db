# node-employee-db
![dependencies status](https://img.shields.io/david/maxlemieux/node-employee-db?style=for-the-badge)
![code size](https://img.shields.io/github/languages/code-size/maxlemieux/node-employee-db?style=for-the-badge)

## Table of Contents
* [About](#about)
* [Installation](#installation)
* [Usage](#usage)
* [Technologies](#technologies)

## About
CLI tool to manage a database of employees, built in Node.js.

## Installation

### Get the code
Clone the repo:

`git clone https://github.com/maxlemieux/node-employee-db`

Change directories to `node-employee-db`:

`cd node-employee-db`

Install the dependencies (`chalk`, `console.table`, `figlet`, `inquirer`, `mysql` and `dotenv`):

`npm i`

### Update settings

Copy the example environment file and change its settings to match your local environment:

`cp .env.example .env`

Open the file `.env` in your favorite editor and change the DB_HOST, DB_USER and DB_PASS settings. Save the changes.

### Create a database

The folder `db` contains two files which can be used to create and populate a database for the app.

Using MySQL Workbench or another method, run the 'schema.sql' file to drop and recreate the `employee_db` database.

Then, run the `seed.sql` file to populate the fresh database with a few entries for each record type.

## Usage

Run the app:

`node app.js`

Follow the interactive prompts to work with department, role and employee entries.

### Employee features
* View All Employees
* View Employees by Manager
* View Employees by Department
* Add Employee
* Update Employee Role
* Update Employee Manager
* Remove Employee

### Role features
* View All Roles
* Add Role
* Remove Role (Only works if role is not assigned to any employees)

### Department features
* View Departments
* Add Department
* Remove Department (Only works if department is not assigned to any roles)

## Technologies used
* Node.js
* inquirer.js
* dotenv