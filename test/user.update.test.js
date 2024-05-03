const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const dummyUser = {
    firstName: 'John',
    lastName: 'Doe',
    emailAdress: 'john.doe@example.com',
    password: 'Password123',
    phoneNumber: '0612345678',
}

const endpointToTest = '/api/user'

describe('UC205 Updaten van usergegevens', () => {
    
    beforeEach((done) => {
        console.log('Before each test')
        done()
    })

    it('TC-205-1 Verplicht veld “emailAddress” ontbreekt', (done) => {
        const emailDummy = {
            firstName: 'John',
            lastName: 'Doe',
            // emailAdress: 'john.doe@example.com' ontbreekt,
            password: 'Password123',
            phoneNumber: '0612345678',
        }

        // status 400
        chai.request(server)
            .put(`${endpointToTest}/0`)
            .send(emailDummy)
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)

                done()
            })
    })

    it.skip('TC-205-2 De gebruiker is niet de eigenaar van de data', (done) => {
        // status 403
        // Nog niet mogelijk
        done()
    })

    
    it('TC-205-3 Niet-valide telefoonnummer', (done) => {
        const phoneNumberDummy = {
            firstName: 'John',
            lastName: 'Doe',
            emailAdress: 'john.doe@example.com',
            password: 'Password123',
            phoneNumber: '1234567890',
        }

        // status 400
        chai.request(server)
            .put(`${endpointToTest}/0`)
            .send(phoneNumberDummy)
            .end((err, res) => {
                chai.expect(res.body).to.be.a('object')
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)

                done()
            })
    })

    
    it('TC-205-5 Gebruiker bestaat niet', (done) => {
        // status 404
        chai.request(server)
            .put(`${endpointToTest}/7`)
            .send(dummyUser)
            .end((err, res) => {
                chai.expect(res).to.have.status(404)
                chai.expect(res).not.to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                done()
            })
    })
    
   
    it.skip('TC-205-5 Niet ingelogd', (done) => {
        // status 401
        // Nog niet mogelijk
        done()
    })

    it('TC-205-6 Gebruiker succesvol gewijzigd', (done) => {
        // status 200
        chai.request(server)
            .put(`${endpointToTest}/0`)
            .send(dummyUser)
            .end((err, res) => {
                chai.expect(res).to.have.status(200)
                chai.expect(res).not.to.have.status(404)

                done()
            })
    })

})
