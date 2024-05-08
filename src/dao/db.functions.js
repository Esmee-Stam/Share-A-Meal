const database = require('../../maria-db.js');
const dtb = {
 
    getAll(callback) {
        const query = 'SELECT * FROM user';
        database.query(query, (error, results) => {
          if (error) {
            callback(error);
            return;
          }
          callback(null, results);
        })
    }
   
 
}
 
module.exports = dtb