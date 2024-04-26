const database = require('../dao/inmem-db')
const logger = require('../util/logger')

const userService = {
    create: (user, callback) => {
        logger.info('create user', user)
        database.add(user, (err, data) => {
            if (err) {
                logger.info(
                    'error creating user: ',
                    err.message || 'unknown error'
                )
                callback(err, null)
            } else {
                logger.trace(`User created with id ${data.id}.`)
                callback(null, {
                    message: `User created with id ${data.id}.`,
                    data: data
                })
            }
        })
    },

    getAll: (callback) => {
        logger.info('getAll')
        database.getAll((err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `Found ${data.length} users.`,
                    data: data
                })
            }
        })
    },
    getById: (id, callback) => {
        database.getById(id, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                console.log(data)
                callback(null, {
                    message: `Found user with id ${id}.`,   
                    data: data  
                })
            }
        }
    )},

      // update
      update(userId, updatedUser, callback) {
        database.update(userId, updatedUser, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `Updated user with id ${userId}`,
                    data: data
                })
            }
        })
    },
 
    // delete
    delete: (id, callback) => {
        database.delete(id, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `User deleted with id ${id}.`,
                    data: data
                })
            }
        })
    }
}


module.exports = userService
