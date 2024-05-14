const jwt = require('jsonwebtoken')
const logger = require('../util/logger')
const mealService = require('../services/meal.service')

function validateAuthorizeMeal(req, res, next) {
    logger.info('authorizeMeal called')
    logger.trace('Headers:', req.headers)
   
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.decode(token)
    const tokenUserId = decodedToken ? decodedToken.userId : null

    if (!tokenUserId) {
        logger.warn('User ID missing from token!')
        return next({
            status: 401,
            message: 'User ID missing from token!',
            data: {}
        })
    }

    const requestedMealId = req.params.mealId

    mealService.getById(requestedMealId, (error, result) => {
        if (error) {
            return next({
                status:  404, 
                message: 'Meal not found', 
                data: {}
            })
        }

        const mealCookId = result.data && result.data[0] ? result.data[0].cookId : null

        if (!mealCookId) {
            logger.warn('Cook ID missing from meal!')
            return next({
                status: 403,
                message: 'Cook ID missing from meal!',
                data: {}
            })
        }

        if (tokenUserId !== mealCookId) {
            logger.warn(`You are not authorized to modify or delete another user's data!`)
            return next({
                status: 403,
                message: `You are not authorized to modify or delete another user's data!`,
                data: {}
            })
        }

        next()
    })
}

module.exports = {validateAuthorizeMeal}
