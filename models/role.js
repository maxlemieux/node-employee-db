const connection = require('../config/connection.js');

const Role = {
  viewAll: function() {
    const sql = `SELECT r.title AS Title, 
                        r.salary AS Salary, 
                        d.name AS Department 
                   FROM role r
                        LEFT JOIN department d
                        ON d.id = r.department_id
                  ORDER BY r.id`;
    return new Promise(function(resolve, reject){
      connection.query(sql, function(err, data) {
        if (err) reject(err);
        resolve(data);
      });
    });
  },
  add: function(newRoleObj) {
    const sql = 'INSERT INTO role SET ?';
    return new Promise(function(resolve, reject){
      connection.query(sql, newRoleObj, function(err, data) {
        if (err) reject(err);
        resolve(data);
      });
    });
  },
  remove: function(roleId) {
    const sql = 'DELETE FROM role WHERE id = ?';
    return new Promise(function(resolve, reject) {
      connection.query(sql, [roleId], function(err, data) {
        if (err) reject(err);
        resolve(data);
      });
    });
  }
};

module.exports = Role;