const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user'

describe('UC-202 Opvragen van overzicht van users', () => {
    
    beforeEach((done) => {
        console.log('Before each test')
        done()
    })

    it('TC-202-1 Toon alle gebruikers (minimaal 2)', (done) => {
        chai.request(server)
            .get(endpointToTest) 
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.an('object')
                res.body.should.have.property('data').that.is.an('array').with.lengthOf.at.least(2)
                done()
            })
    })

    it.skip('TC-202-2 Toon gebruikers met zoekterm op niet-bestaande velden', (done) => {
        // Code bevat geen zoekterm-functie
        done()
    })
    
    it.skip('TC-202-3 Toon gebruikers met gebruik van de zoekterm op het veld ‘isActive’=false', (done) => {
        // Code bevat geen zoekterm-functie
        done()
    })

    it.skip('TC-202-4 Toon gebruikers met gebruik van de zoekterm op het veld ‘isActive’=true', (done) => {
        // Code bevat geen zoekterm-functie
        done()
    })

    it.skip('TC-202-5 Toon gebruikers met zoektermen op bestaande velden (max op 2 velden filteren)', (done) => {
         // Code bevat geen zoekterm-functie
        done()
    })
})
