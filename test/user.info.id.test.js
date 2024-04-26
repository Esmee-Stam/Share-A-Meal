const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user'

describe('UC204 Opvragen van usergegevens bij ID', () => {
    
    beforeEach((done) => {
        console.log('Before each test')
        done()
    })

    it.skip('TC-204-1 Ongeldig token', (done) => {
        // status 401
        // Nog niet mogelijk
        done()
    })

    it.skip('TC-204-2 Gebruiker-Id bestaat niet', (done) => {
        chai.request(server)
            .get(`${endpointToTest}/7`)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
    
    
    it('TC-204-3 Gebruiker-ID bestaat', (done) => {
        // status 200
        chai.request(server)
        .get(`${endpointToTest}/1`)
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.an('object')
            res.body.should.have.property('data')
            done()
        })
    })

})