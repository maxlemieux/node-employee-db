const connection = require('../config/connection.js');

const Role = {
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