const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')
const database = require('../src/dao/inmem-db')
 
chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')
 
const endpointToTest = '/api/login'
 
describe('UC101 Inloggen', () => {
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
    it('TC-101-1 Verplicht veld ontbreekt', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                emailAdress: 'v.a@server.nl'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(400)
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty
 
                done()
            })
    })    
 
    it('TC-101-2 Niet-valide password', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                emailAdress: 'm.vandullemen@server.nl',
                password: '1234567' // Ongeldig wachtwoord (minder dan 8 tekens)
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(400)
                chai.expect(res.body).to.have.property('data').that.is.a('object').that.is.empty
                done()
            })
    })
 
    it('TC-101-3 Gebruiker bestaat niet', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                emailAdress: 'john@doe.com',
                password: '12345678'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(404)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(404)
                done()
            })
    })
 
    it('TC-101-4 User successfully logged in', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                emailAdress: 'm.vandullemen@server.nl',
                password: 'secret',
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('data').that.is.a('object')
                chai.expect(res.body.data).to.have.property('token').that.is.a('string')
                done()
            })
    })
})