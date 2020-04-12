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

Clone the repo:

`git clone https://github.com/maxlemieux/node-employee-db`

Change directories to `node-employee-db`:

`cd node-employee-db`

Install the dependencies (`chalk`, `console.table`, `figlet`, `inquirer`, `mysql` and `dotenv`):

`npm i`

Copy the example environment file and change its settings to match your local environment:

`cp .env.example .env`

Open the file `.env` in your favorite editor and change the DB_HOST, DB_USER and DB_PASS settings. Save the changes.

## Usage

Run the app:

`node app.js`

Follow the interactive prompts to work with department, role and employee entries.

## Technologies used
* Node.js
* inquirer.js
* dotenv