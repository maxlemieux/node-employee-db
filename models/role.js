const connection = require('../config/connection.js');

const Role = {
  viewAll: function() {
    const sql = 'SELECT * FROM role';
    return new Promise(function(resolve, reject){
      connection.query(sql, function(err, data) {
        if (err) reject(err);
        resolve(data);
      });
    });
  },
  add: function(newDepartmentObj) {
    const sql = 'INSERT INTO role SET ?';
    return new Promise(function(resolve, reject){
      connection.query(sql, newDepartmentObj, function(err, data) {
        if (err) reject(err);
        resolve(data);
      });
    });
  },
  getIdByTitle: function(roleTitle) {
    const sql = 'SELECT id FROM role WHERE ?';
    return new Promise(function(resolve, reject){
      connection.query(sql, { title: roleTitle }, function(err, data) {
        if (err) reject(err);
        resolve(data);
      });
    });
  }
};
// Role.getIdByTitle('Bottle Washer').then(data => console.log(data[0].id));
// Role.viewAll().then(data => {
//   /* Get an array of all the role titles to use for choices */
//   return data.map(role => role.title);
// }).then(data => {
//   console.log(data);
// })
module.exports = Role;