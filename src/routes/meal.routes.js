const express = require('express')
const assert = require('assert')
const chai = require('chai')
chai.should()
const router = express.Router()
const mealController = require('../controllers/meal.controller')
const validateToken = require('./authentication.routes').validateToken
const validateAuthorizeUser = require('./authentication.routes').validateAuthorizeUser
const validateAuthorizeMeal = require('./authentication.routes').validateAuthorizeMeal
const logger = require('../util/logger')


// Meal validation
// Create
const validateMealCreate = (req, res, next) => {
    try {
        chai.expect(req.body.name, 'Missing or incorrect name field').to.be.a('string').and.to.not.be.empty
        chai.expect(req.body.description, 'Missing or incorrect description field').to.be.a('string').and.to.not.be.empty
        chai.expect(req.body.price, 'Missing or incorrect price field').to.be.a('number')
        chai.expect(req.body.dateTime, 'Missing or incorrect dateTime field').to.be.a('string').and.to.not.be.empty
        chai.expect(req.body.maxAmountOfParticipants, 'Missing or incorrect maxAmountOfParticipants field').to.be.a('number')
        chai.expect(req.body.imageUrl, 'Missing or incorrect imageUrl field').to.be.a('string').and.to.not.be.empty
 
        next()
    } catch (ex) {
        return res.status(400).json({
            status: 400,
            message: ex.message,
            data: {}
        })
    }
}
 
// Update
const validateMealUpdate = (req, res, next) => {
    try {
        chai.expect(req.body.name, 'Missing or incorrect name field').to.exist.and.to.be.a('string').and.to.not.be.empty
        chai.expect(req.body.price, 'Missing or incorrect price field').to.exist.and.to.not.be.empty.and.to.be.a('number')
        chai.expect(req.body.maxAmountOfParticipants, 'Missing or incorrect maxAmountOfParticipants field').to.exist.and.to.not.be.empty.and.to.be.a('number')
        next()
    } catch (ex) {
        let statusCode = 400
        return res.status(statusCode).json({
            status: statusCode,
            message: ex.message,
            data: {}
        })
    }
}

// MealsRoutes
router.post('/api/meal', validateToken, validateMealCreate, mealController.create)
 
router.put('/api/meal/:mealId', validateToken, validateMealUpdate, validateAuthorizeMeal, mealController.update)
 
router.get('/api/meal/', validateToken, mealController.getAll)
 
router.get('/api/meal/:mealId', validateToken, mealController.getById)
 
router.delete('/api/meal/:mealId', validateToken, validateAuthorizeMeal, mealController.delete)
 
module.exports = router