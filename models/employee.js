const connection = require('../config/connection.js');

const Employee = {
  viewAll: function() {
    const sql = `SELECT e.id, 
                        CONCAT(e.last_name, ', ', e.first_name) AS Employee, 
                        r.title, 
                        IFNULL(CONCAT(m.last_name, ', ', m.first_name), 'None') AS Manager 
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
    })
  }
}

// Employee.viewAll().then(data => {
//   console.log(data);
// }).catch(err => {
//   console.log(err);
// });

module.exports = Employee;