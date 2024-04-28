const express = require('express')
const assert = require('assert')
const chai = require('chai')
chai.should()
const router = express.Router()
const userController = require('../controllers/user.controller')
const logger = require('../util/logger')

// Validation user
const validateUser = (req, res, next) => {
    try {
        // Firstname validation
        console.log('Validating firstName:', req.body.firstName)
        assert(req.body.firstName, 'Missing or incorrect firstName field')
        chai.expect(req.body.firstName).to.not.be.empty
        chai.expect(req.body.firstName).to.be.a('string')
        chai.expect(req.body.firstName).to.match(
            /^[a-zA-Z]+$/,
            'firstName must be a string'
        )

        // Lastname validation
        console.log('Validating lastName:', req.body.lastName)
        assert(req.body.lastName, 'Missing or incorrect lastName field')
        chai.expect(req.body.lastName).to.not.be.empty
        chai.expect(req.body.lastName).to.be.a('string')
        chai.expect(req.body.lastName).to.match(
            /^[a-zA-Z]+(?: [a-zA-Z]+)?$/,
            'lastName must be a string'
        );

        // EmailAdress validation
        console.log('Validating emailAdress:', req.body.emailAdress)
        assert(req.body.emailAdress, 'Missing or incorrect email field')
        chai.expect(req.body.emailAdress).to.not.be.empty
        chai.expect(req.body.emailAdress).to.be.a('string')
        chai.expect(req.body.emailAdress).to.match(
            /^[a-zA-Z0-9]+\.[a-zA-Z]{2,}@[a-zA-Z]{2,}\.[a-zA-Z]{2,3}$/,
            'Invalid emailAdress'
        );

        // Password validation
        console.log('Validating password:', req.body.password)
        assert(req.body.password, 'Missing or incorrect password field')
        chai.expect(req.body.password).to.not.be.empty
        chai.expect(req.body.password).to.be.a('string')
        chai.expect(req.body.password).to.match(
            /^(?=.*[A-Z])(?=.*\d).{8,}$/,
            'password must be at least 8 characters with at least one uppercase letter and one digit'
        );

        // PhoneNumber validation  
        console.log('Validating phoneNumber:', req.body.phoneNumber)
        assert(req.body.phoneNumber, 'Missing or incorrect phoneNumber field')
        chai.expect(req.body.phoneNumber).to.not.be.empty
        chai.expect(req.body.phoneNumber).to.be.a('string')
        chai.expect(req.body.phoneNumber).to.match(
            /^06[\s-]?\d{8}$/,
            'phoneNumber must be in the format 06-12345678, 06 12345678, or 0612345678'
        );

        next();

    } catch (ex) {
        console.error('Validation error:', ex.message)
        next({
            status: 400,
            message: ex.message,
            data: {}
        })
    }
}

// Userroutes

// Create user
router.post('/api/user', validateUser, userController.create)

// Read all users
router.get('/api/user', userController.getAll)

// Read one user
router.get('/api/user/:userId', userController.getById)

// Update user
router.put('/api/user/:userId', validateUser, userController.update)

// Delete user
router.delete('/api/user/:userId', userController.delete)

module.exports = router
