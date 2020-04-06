/* Pattern from https://jarednielsen.com/object-relational-mapping-javascript-orm/ */

const dotenv = require('dotenv')
const dotenvResult = dotenv.config()
if (dotenvResult.error) throw dotenvResult.error;

const mysql = require('mysql');

const connection = mysql.createConnection(
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "employee_db"
  }
);

connection.connect(err => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
});

module.exports = connection;