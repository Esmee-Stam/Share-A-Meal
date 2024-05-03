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

    it('TC-206-1 Gebruiker bestaat niet', (done) => {
        // status 404
        chai.request(server)
        .delete(`${endpointToTest}/7`)
        .end((err, res) => {
            chai.expect(res).to.have.status(404)
            chai.expect(res.body).to.have.property('status').equals(404)
            chai.expect(res.body).to.have.property('message').equals('User does not exist.')
            done()
        })
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

    it('TC-206-3 Gebruiker succesvol verwijderd', (done) => {
        // status 200
        chai.request(server)
        .delete(`${endpointToTest}/1`)
        .end((err, res) => {
            chai.expect(res).to.have.status(200)
            chai.expect(res.body).to.be.a('object')
            chai.expect(res.body).to.have.property('data')
            done()
        })

    })
})