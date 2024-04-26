const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user'

describe('UC205 Updaten van usergegevens', () => {
    
    beforeEach((done) => {
        console.log('Before each test')
        done()
    })

    it.skip('TC-205-1 Verplicht veld “emailAddress” ontbreekt', (done) => {
        // status 400
        done()
    })

    it.skip('TC-205-2 De gebruiker is niet de eigenaar van de data', (done) => {
        // status 403
        done()
    })

    
    it.skip('TC-205-3 Niet-valide telefoonnummer', (done) => {
        // status 403
        done()
    })

    it.skip('TC-205-4 Gebruiker bestaat niet', (done) => {
        // status 400
        done()
    })

    it.skip('TC-205-5 Niet ingelogd', (done) => {
        // status 401
        // Nog niet mogelijk
        done()
    })

    it.skip('TC-205-6 Gebruiker succesvol gewijzigd', (done) => {
        // status 200
        done()
    })

})
