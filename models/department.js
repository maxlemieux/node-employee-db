const connection = require('../config/connection.js');

const Department = {
  viewAll: function() {
    const sql = 'SELECT * FROM department';
    return new Promise(function(resolve, reject){
      connection.query(sql, function(err, data) {
        if (err) reject(err);
        resolve(data);
      });
    })
  },
  add: function(newDepartmentObj) {
    const sql = 'INSERT INTO department SET ?';
    return new Promise(function(resolve, reject){
      connection.query(sql, newDepartmentObj, function(err, data) {
        if (err) reject(err);
        resolve(data);
      });
    })
  }
}

// Employee.viewAll().then(data => {
//   console.log(data);
// }).catch(err => {
//   console.log(err);
// });

module.exports = Department;