require('dotenv').config()

const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "PASSWORD",
  database: "top_songsDB"
});