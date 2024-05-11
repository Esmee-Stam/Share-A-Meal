const express = require('express')
const assert = require('assert')
const chai = require('chai')
chai.should()
const router = express.Router()
const mealController = require('../controllers/meal.controller')
const validateToken = require('./authentication.routes').validateToken
const validateAuthorizeMeal = require('./authentication.routes').validateAuthorizeMeal
const logger = require('../util/logger')
 
const validateMealCreateChaiExpect = (req, res, next) => {
    try {
        chai.expect(req.body.name, 'Missing or incorrect name field').to.be.a('string').and.to.not.be.empty;
        chai.expect(req.body.description, 'Missing or incorrect description field').to.be.a('string').and.to.not.be.empty;
        chai.expect(req.body.price, 'Missing or incorrect price field').to.be.a('number');
        chai.expect(req.body.dateTime, 'Missing or incorrect dateTime field').to.be.a('string').and.to.not.be.empty;
        chai.expect(req.body.maxAmountOfParticipants, 'Missing or incorrect maxAmountOfParticipants field').to.be.a('number');
        chai.expect(req.body.imageUrl, 'Missing or incorrect imageUrl field').to.be.a('string').and.to.not.be.empty;
 
        next();
    } catch (ex) {
        return res.status(400).json({
            status: 400,
            message: ex.message,
            data: {}
        });
    }
};
 
 
const validateMealUpdateChaiExpect = (req, res, next) => {
    try {
        chai.expect(req.body.name, 'Missing or incorrect name field').to.be.a('string').and.to.not.be.empty;
        chai.expect(req.body.price, 'Missing or incorrect price field').to.be.a('number');
        chai.expect(req.body.maxAmountOfParticipants, 'Missing or incorrect maxAmountOfParticipants field').to.be.a('number');
        next();
    } catch (ex) {
        let statusCode = 400;
        return res.status(statusCode).json({
            status: statusCode,
            message: ex.message,
            data: {}
        });
    }
};
 
// Userroutes
//301 Toevoegen van maaltijden
router.post('/api/meal', validateToken, validateMealCreateChaiExpect, mealController.create)
 
//302 Wijzigen van maaltijd
router.put('/api/meal/:mealId', validateToken, validateAuthorizeMeal, validateMealUpdateChaiExpect, mealController.update)
 
//303 Opvragen alle maaltijden
router.get('/api/meal', validateToken, mealController.getAll);
 
//304 Opvrage van maaltijden op basis van id
router.get('/api/meal/:mealId', validateToken, mealController.getById)
 
//305 verwijderen van een maaltijd op basis van id
router.delete('/api/meal/:mealId', validateToken, validateAuthorizeMeal, mealController.delete)
 
module.exports = router