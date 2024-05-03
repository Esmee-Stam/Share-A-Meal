const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')
const database = require('../src/dao/inmem-db')


chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user'

describe('UC201 Registreren als nieuwe user', () => {
    /**
     * Voorbeeld van een beforeEach functie.
     * Hiermee kun je code hergebruiken of initialiseren.
     */
    beforeEach((done) => {
        console.log('Before each test')
        done()
    })

    /**
     * Hier starten de testcases
     */
    it('TC-201-1 Verplicht veld ontbreekt', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                // firstName: 'Voornaam', ontbreekt
                lastName: 'Achternaam',
                emailAdress: 'v.a@server.nl'
            })
            .end((err, res) => {
                /**
                 * Voorbeeld uitwerking met chai.expect
                 */
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(201)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(400)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals('Missing or incorrect firstName field')
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty

                done()
            })
    })

    it('TC-201-2 Niet-valide email adres', (done) => {
        // Status 400
        const emailDummy = {
            firstName: 'John',
            lastName: 'Doe',
            emailAdress: 'johndoeexample.com', // niet-valide emailAdress
            password: 'Password123', 
            phoneNumber: '0612345678',
        }

        chai.request(server)
            .post(endpointToTest)
            .send(emailDummy)
            .end((err, res) => {
                res.should.have.status(400)
                done()
            })
    })

    it('TC-201-3 Niet-valide wachtwoord', (done) => {
        // Status 400
        const passwordDummy = {
            firstName: 'John',
            lastName: 'Doe',
            emailAdress: 'john.doe@example.com',
            password: 'password123', // niet-valide wachtwoord
            phoneNumber: '0612345678',
        }
        
        chai.request(server)
            .post(endpointToTest)
            .send(passwordDummy)
            .end((err, res) => {
                res.should.have.status(400)
                done()
            })
    })

    it('TC-201-4 Gebruiker bestaat al', (done) => {
        // status 403
        const existingUser = {
            firstName: 'John',
            lastName: 'Doe',
            emailAdress: 'hvd@server.nl', // emaiAdress bestaat al
            password: 'Password123',
            phoneNumber: '0612345678'
        }
   
        database.add(existingUser, (err, data) => {
            if (err) {
                chai.expect(err).to.have.property('status').equals(403)
                chai.expect(err).to.have.property('message').equals('Email address already exists')
                done()
            } else {
                done(new Error('Expected error was not thrown'))
            }
        })
    })

    it('TC-201-5 Gebruiker succesvol geregistreerd', (done) => {
        const dummyUser = {
            firstName: 'John',
            lastName: 'Doe',
            emailAdress: 'john.doe@example.com',
            password: 'Password123',
            phoneNumber: '0612345678',
        }
    
        chai.request(server)
            .post(endpointToTest)
            .send(dummyUser)
            .end((err, res) => {
                chai.expect(res).to.have.status(201)
                chai.expect(res).not.to.have.status(400)

                done()
            })
    })
    
})
