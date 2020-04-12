const connection = require('../config/connection.js');

const Department = {
  viewAll: function() {
    const sql = `SELECT d.name AS Department, 
                        COUNT(e.id) AS Employees, 
                        COALESCE(SUM(r.salary), 0) AS Budget
                   FROM employee e
                        LEFT JOIN role r
                        ON e.role_id = r.id
         
                        RIGHT JOIN department d
                        ON d.id = r.department_id
                  GROUP BY d.name;`;
    return new Promise(function(resolve, reject){
      connection.query(sql, function(err, data) {
        if (err) reject(err);
        resolve(data);
      });
    });
  },
  add: function(newDepartmentObj) {
    const sql = 'INSERT INTO department SET ?';
    return new Promise(function(resolve, reject){
      connection.query(sql, newDepartmentObj, function(err, data) {
        if (err) reject(err);
        resolve(data);
      });
    });
  },
  remove: function(departmentId) {
    const sql = 'DELETE FROM department WHERE id = ?';
    return new Promise(function(resolve, reject) {
      connection.query(sql, [departmentId], function(err, data) {
        if (err) reject(err);
        resolve(data);
      });
    });
  }
};

module.exports = Department;