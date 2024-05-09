const logger = require('../util/logger')
const db = require('../dao/mysql-db')

const userService = {
    create: (newUser, callback) => {
        logger.info('create', newUser)
    
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            } else {
                connection.query('SELECT MAX(id) AS maxId FROM `user`', function (error, results) {
                    if (error) {
                        connection.release()
                        logger.error(error)
                        callback(error, null)
                    } else {
                        const maxId = results[0].maxId || 0
                        const newUserId = maxId + 1
    
                        const newRoles = newUser.roles && newUser.roles.length > 0 ? newUser.roles.join(',') : '' 
    
                        connection.query(
                            'INSERT INTO `user` (`id`, `firstName`, `lastName`, `isActive`, `emailAdress`, `password`, `phoneNumber`, `roles`, `street`, `city`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                            [newUserId,
                                newUser.firstName,
                                newUser.lastName,
                                newUser.isActive ? 1 : 0 || 1,
                                newUser.emailAdress,
                                newUser.password,
                                newUser.phoneNumber,
                                newRoles,
                                newUser.street || null,
                                newUser.city || null
                            ],
    
                            function (error, results) {
                                if (error) {
                                    connection.release()
                                    logger.error(error)
                                    callback(error, null)
                                } else {
                                    connection.query(
                                        'SELECT * FROM `user` WHERE `id` = ?',
                                        [newUserId],
                                        function (error, userResults) {
                                            connection.release()
    
                                            if (error) {
                                                logger.error(error)
                                                callback(error, null)
                                            } else {
                                                if (userResults.length > 0) {
                                                    userResults[0].roles = userResults[0].roles.split(',')
                                                }

                                                logger.debug('Newly created user:', userResults)
                                                callback(null, {
                                                    message: `User created with id ${newUserId}.`,
                                                    data: userResults,
                                                    status: 201
                                                })
                                            }
                                        }
                                    )
                                }
                            }
                        )
                    }
                })
            }
        })
    },    

    getAll: (callback) => {
        logger.info('getAll')
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT * FROM `user`',
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        logger.debug(results)
                        callback(null, {
                            message: `Found ${results.length} users.`,
                            data: results
                        })
                    }
                }
            )
        })
    },

    getById: (id, callback) => {
        logger.info('getById', id)
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT * FROM `user` WHERE `id` = ?',
                [id],
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        logger.debug(results)
                        if (results.length === 0) {
                            callback(
                                { message: `Error: id ${id} does not exist!` },
                                null
                            )
                            return
                        }
                        callback(null, {
                            message: `Found user with id ${id}.`,
                            data: results
                        })
                    }
                }
            )
        })
    },

    getProfile: (userId, callback) => {
        logger.info('getProfile userId:', userId)

        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT id, firstName, lastName FROM `user` WHERE id = ?',
                [userId],
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        logger.debug(results)
                        callback(null, {
                            message: `Found ${results.length} user.`,
                            data: results
                        })
                    }
                }
            )
        })
    },

    update: (id, updatedUser, callback) => {
        logger.info('update', id, updatedUser)
    
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }
    
            const updatedRoles = updatedUser.roles && updatedUser.roles.length > 0 ? updatedUser.roles.join(',') : '' 
    
            connection.query(
                'UPDATE `user` SET `firstName` = ?, `lastName` = ?, `emailAdress` = ?, `password` = ?, `isActive` = ?, `street` = ?, `city` = ?, `phoneNumber` = ?, `roles` = ? WHERE `id` = ?',
                [updatedUser.firstName, 
                    updatedUser.lastName, 
                    updatedUser.emailAdress, 
                    updatedUser.password,
                    updatedUser.isActive || null, 
                    updatedUser.street || null,
                    updatedUser.city || null, 
                    updatedUser.phoneNumber, 
                    updatedRoles, 
                    id],
                function (error, results, fields) {
                    connection.release()
    
                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        logger.debug(results)
    
                        connection.query(
                            'SELECT * FROM `user` WHERE `id` = ?',
                            [id],
                            function (error, updatedUserResults) {
                                if (error) {
                                    logger.error(error)
                                    callback(error, null)
                                } else {
                                    // Split roles string into an array
                                    if (updatedUserResults.length > 0) {
                                        updatedUserResults[0].roles = updatedUserResults[0].roles.split(',')
                                    }
                                    callback(null, {
                                        message: `User with id ${id} updated.`,
                                        data: updatedUserResults
                                    })
                                }
                            }
                        )
                    }
                }
            )
        })
    },    
    
    delete: (UserId, callback) => {
        logger.info('delete', UserId)
     
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }
     
            connection.query(
                'SELECT * FROM `user` WHERE `id` = ?',
                [UserId],
                function (error, userResults) {
                    if (error) {
                        logger.error(error)
                        callback(error, null)
                        return
                    }
     
                    connection.query(
                        'DELETE FROM `user` WHERE `id` = ?',
                        [UserId],
                        function (error, results) {
                            connection.release()
     
                            if (error) {
                                logger.error(error)
                                callback(error, null)
                            } else {
                                logger.debug(results)
                                if (results.affectedRows === 0) {
                                    callback(
                                        { message: `Error: id ${UserId} does not exist!` },
                                        null
                                    )
                                    return
                                }
                                callback(null, {
                                    message: `Deleted user with id ${UserId}.`,
                                    data: userResults
                                })
                            }
                        }
                    )
                }
            )
        })
    }
}

module.exports = userService