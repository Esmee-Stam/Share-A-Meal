const logger = require('../util/logger')
const db = require('../dao/mysql-db')
const jwt = require('jsonwebtoken')

let mealService = {
    
    create: (mealData, userId, callback) => {
        logger.info('create meal', mealData)
 
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }
 
            let newMealId = null
            connection.query(
                'INSERT INTO `meal` (`isActive`, `isVega`, `isVegan`, `isToTakeHome`, `dateTime`, `maxAmountOfParticipants`, `price`, `imageUrl`, `cookId`, `name`, `description`, `allergenes`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    mealData.isActive ? 1 : 0 || 1,
                    mealData.isVega ? 1 : 0,
                    mealData.isVegan ? 1 : 0,
                    mealData.isToTakeHome ? 1 : 0,
                    mealData.dateTime,
                    mealData.maxAmountOfParticipants,
                    mealData.price,
                    mealData.imageUrl || null,
                    userId, 
                    mealData.name,
                    mealData.description,
                    mealData.allergenes ? mealData.allergenes.join(',') : ''
                ],
                function (error, results) {
                    if (error) {
                        connection.release()
                        logger.error(error)
                        callback(error, null)
                    } else {
                        newMealId = results.insertId
 
                        connection.query(
                            'SELECT * FROM `meal` WHERE `id` = ?',
                            [newMealId],
                            function (error, mealResults) {
                                connection.release()
 
                                if (error) {
                                    logger.error(error)
                                    callback(error, null)
                                } else {
                                    if (mealResults.length > 0) {
                                        mealResults[0].allergenes = mealResults[0].allergenes.split(',')
                                    }
 
                                    logger.debug('Newly created meal:', mealResults)
                                    callback(null, {
                                        message: `Meal created with id ${newMealId}.`,
                                        data: mealResults,
                                        status: 201
                                    })
                                }
                            }
                        )
                    }
                }
            )
        })
    },
    
    getAll: (callback) => {
        logger.info('getAll - meal')
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT * FROM `meal`',
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        logger.debug(results)
                        callback(null, {
                            status: 200,
                            message: `Found ${results.length} meals.`,
                            data: results
                        })
                    }
                }
            )
        })
    },

    getById: (id, callback) => {
        logger.info('getById - meal', id)
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT * FROM `meal` WHERE `id` = ?',
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
                            status: 200,
                            message: `Found meal with id ${id}.`,
                            data: results
                        })
                    }
                }
            )
        })
    },

    update: (mealId, mealData, userId, callback) => {
        logger.info('update meal', mealData)
 
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }
 
            connection.query(
                'UPDATE `meal` SET `isActive` = ?, `isVega` = ?, `isVegan` = ?, `isToTakeHome` = ?, `dateTime` = ?, `maxAmountOfParticipants` = ?, `price` = ?, `imageUrl` = ?, `name` = ?, `description` = ?, `allergenes` = ? WHERE `id` = ? AND `cookId` = ?',
                [
                    mealData.isActive ? 1 : 0 || 1,
                    mealData.isVega ? 1 : 0,
                    mealData.isVegan ? 1 : 0,
                    mealData.isToTakeHome ? 1 : 0,
                    mealData.dateTime,
                    mealData.maxAmountOfParticipants,
                    mealData.price,
                    mealData.imageUrl || null,
                    mealData.name,
                    mealData.description,
                    mealData.allergenes ? mealData.allergenes.join(',') : '',
                    mealId,
                    userId
                ],
                function (error, results) {
                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        connection.query(
                            'SELECT * FROM `meal` WHERE `id` = ?',
                            [mealId],
                            function (error, mealResults) {
                                if (error) {
                                    logger.error(error)
                                    callback(error, null)
                                } else {
                                    if (mealResults.length > 0) {
                                        mealResults[0].allergenes = mealResults[0].allergenes.split(',')
                                    }
 
                                    logger.debug('Updated meal:', mealResults)
                                    callback(null, {
                                        message: `Meal updated with id ${mealId}.`,
                                        data: mealResults,
                                        status: 200
                                    })
                                }
                            }
                        )
                    }
                }
            )
        })
    },

    delete: (mealId, callback) => {
        logger.info('delete - meal', mealId)
    
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }
            connection.query(
                'SELECT * FROM `meal` WHERE `id` = ?',
                [mealId],
                function (error, mealResults) {
                    if (error) {
                        logger.error(error)
                        callback(error, null)
                        return
                    }
                    if (mealResults.length === 0) {
                        callback({ status: 404, message: `Meal with ID ${mealId} not found!` }, null)
                        return
                    }
                    connection.query(
                        'DELETE FROM `meal` WHERE `id` = ?',
                        [mealId],
                        function (error, results) {
                            connection.release()
    
                            if (error) {
                                logger.error(error)
                                callback(error, null)
                            } else {
                                logger.debug(results)
                                callback(null, {
                                    message: `Deleted meal with id ${mealId}.`,
                                    data: mealResults[0],
                                    status: 200
                                })
                            }
                        }
                    )
                }
            )
        })
    }
    
}

module.exports = mealService
