const database = require('../../maria-db.js');
const { create } = require('../services/user.service.js');
const dtb = {
 
    getAll(callback) {
        const query = 'SELECT * FROM user'
        database.query(query, (error, results) => {
          if (error) {
            callback(error)
            return
          }
          callback(null, results)
        })
    },

    getById(id, callback) {
        const query = 'SELECT * FROM user WHERE id = ?'
        database.query(query, id, (error, results) => {
          if (error) {
            callback(error)
            return
          }
          if (results.length === 0) {
            callback({ message: `Error: id ${id} does not exist!` }, null);
            return
          }
          callback(null, results[0]);
        })
    },

    
   
 
}
 
module.exports = dtb