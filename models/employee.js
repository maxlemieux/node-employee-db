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
    });
  },
  // getIdByName: function(employeeName) {
  //   let employeeId = 'foo';
  //   const sql = `SELECT id
  //                  FROM employee
  //                 WHERE (CONCAT(last_name, ', ', first_name)) = '${employeeName}'`;
  //   connection.query(sql, (err, rows) => {
  //     if (err) throw err;
  //     // console.log(employeeId);
  //     // console.log(data[0].id)
  //     employeeId = rows[0].id;
  //   })
  // },
};

module.exports = Employee;