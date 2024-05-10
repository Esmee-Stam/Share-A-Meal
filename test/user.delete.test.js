process.env.DB_DATABASE = process.env.DB_DATABASE || 'share-a-meal-testdb'
process.env.LOGLEVEL = 'trace'
 
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')
const database = require('../src/dao/mysql-db')
const logger = require('../src/util/logger')
 
chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')
 
const endpointToTest = '/api/user'
 
//Database queries
const CLEAR_MEAL_TABLE = 'DELETE IGNORE FROM `meal`;'
const CLEAR_PARTICIPANTS_TABLE = 'DELETE IGNORE FROM `meal_participants_user`;'
const CLEAR_USERS_TABLE = 'DELETE IGNORE FROM `user`;'
const CLEAR_DB = CLEAR_MEAL_TABLE + CLEAR_PARTICIPANTS_TABLE + CLEAR_USERS_TABLE
 
const INSERT_USER =
'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city` ) VALUES' +
'(1, "first", "last", "name@server.nl", "secret", "street", "city");'
 
describe('UC-206 Verwijderen van user', () => {
    beforeEach((done) => {
        logger.debug('beforeEach called')
        database.getConnection(function (err, connection) {
            if (err) throw err
   
            connection.query(
                CLEAR_DB + INSERT_USER,
                function (error, results, fields) {
                    connection.release()
                    if (error) throw error
                    logger.debug('beforeEach done')
                    done()
                }
            )
        })
    })
 
    it('TC-206-1 Gebruiker bestaat niet', (done) => {
        const nonExistingUserId = 7 // Een id van een niet bestaande gebruiker
        const deleteQuery = 'DELETE FROM `user` WHERE `id` = ?'
       
        database.getConnection(function (err, connection) {
            if (err) {
                done(err)
                return
            }
   
            connection.query(deleteQuery, [nonExistingUserId], function (error, results) {
                connection.release()
                if (error) {
                    done(error)
                    return
                }
   
                chai.expect(results.affectedRows).to.equal(0) 
                done()
            })
        })
    })
 
    it('TC-206-2 Gebruiker niet ingelogd', (done) => {
        chai.request(server)
            .delete(`${endpointToTest}/1`)
            .end((err, res) => {
                chai.expect(res).to.have.status(401)
                chai.expect(res.body).to.be.an('object')
                chai.expect(res.body).to.have.property('status').equals(401)
                chai.expect(res.body).to.have.property('message').equals('Authorization header missing!')
                chai.expect(res.body).to.have.property('data').that.is.an('object').that.is.empty
                done()
            })
    })
 
    it('TC-206-3 Gebruiker is niet de eigenaar van de data', (done) => {
        chai.request(server)
            .delete(`${endpointToTest}/2`)
            .set('Authorization', 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTcxNTMzMzQ2MywiZXhwIjoxNzE2MzcwMjYzfQ.nDIpZ78n76JxsDckbqJwg1ew2RAF4smIcLYhwcf6Dnw')
            .end((err, res) => {
                chai.expect(res).to.have.status(403)
                chai.expect(res.body).to.be.an('object')
                chai.expect(res.body).to.have.property('status').equals(403)
                chai.expect(res.body).to.have.property('message').equals('Not authorized to modify / delete data of another user!')
                chai.expect(res.body).to.have.property('data').that.is.an('object').that.is.empty
                done()
            })
    })
   
    it('TC-206-4 Gebruiker succesvol verwijderd', (done) => {
        const existingUserId = 1
   
        const deleteQuery = 'DELETE FROM `user` WHERE `id` = ?'
       
        database.getConnection(function (err, connection) {
            if (err) {
                done(err)
                return
            }
   
            connection.query(deleteQuery, [existingUserId], function (error, results) {
                connection.release()
                if (error) {
                    done(error)
                    return
                }
   
                chai.expect(results.affectedRows).to.equal(1)
                done()
            })
        })
    })
})