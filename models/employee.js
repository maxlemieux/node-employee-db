const connection = require('../config/connection.js');

const Employee = {
  viewAll: function() {
    const sql = `SELECT e.id, 
                        CONCAT(e.first_name, ' ', e.last_name) AS Employee, 
                        r.title, 
                        IFNULL(CONCAT(m.first_name, ' ', m.last_name), 'None') AS Manager 
                   FROM employee AS e 
                        LEFT JOIN role AS r 
                        ON e.role_id = r.id 

                        LEFT JOIN employee AS m 
                        ON e.manager_id = m.id`;
    return new Promise(function(resolve, reject){
      connection.query(sql, function(err, data) {
        if (err) reject(err);
        resolve(data);
      });
    });
  },
  remove: function(employeeId) {
    const sql = 'DELETE FROM employee WHERE id = ?';
    return new Promise(function(resolve, reject) {
      connection.query(sql, [employeeId], function(err, data) {
        if (err) reject(err);
        resolve(data);
      });
    });
  }
};

module.exports = Employee;