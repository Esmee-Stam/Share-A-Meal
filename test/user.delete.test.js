const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user'

describe('UC206 Verwijderen van user', () => {
    
    beforeEach((done) => {
        console.log('Before each test')
        done()
    })

    it.skip('TC-206-1 Gebruiker bestaat niet', (done) => {
        // status 404
        done()
    })

    it.skip('TC-206-2 Gebruiker is niet ingelogd', (done) => {
        // status 401
        // Nog niet mogelijk  
        done()
    })
    
    it.skip('TC-206-3 De gebruiker is niet de eigenaar van de data', (done) => {
        // status 403
        // Nog niet mogelijk
        done()
    })

    it.skip('TC-206-3 Gebruiker succesvol verwijderd', (done) => {
        // status 200
        done()
    })

})