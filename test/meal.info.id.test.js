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
 
const jwt = require('jsonwebtoken')
const jwtSecretKey = require('../src/util/config').secretkey
 
const endpointToTest = '/api/meal'

 
//Database queries
const CLEAR_MEAL_TABLE = 'DELETE IGNORE FROM `meal`;'
const CLEAR_PARTICIPANTS_TABLE = 'DELETE IGNORE FROM `meal_participants_user`;'
const CLEAR_USERS_TABLE = 'DELETE IGNORE FROM `user`;'
const CLEAR_DB = CLEAR_MEAL_TABLE + CLEAR_PARTICIPANTS_TABLE + CLEAR_USERS_TABLE
 
const INSERT_USER =
    'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city` ) VALUES' +
    '(1, "first", "last", "name@server.nl", "secret", "street", "city");'
 
const INSERT_MEALS =
    'INSERT INTO `meal` (`id`, `name`, `description`, `imageUrl`, `dateTime`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES' +
    "(1, 'Meal A', 'description', 'image url', NOW(), 5, 6.50, 1)," +
    "(2, 'Meal B', 'description', 'image url', NOW(), 5, 6.50, 1);"
    
describe('UC-304 Opvragen van maaltijd bij ID', () => {
    beforeEach((done) => {
        logger.debug('beforeEach called')
        database.getConnection(function (err, connection) {
            if (err) throw err
 
            connection.query(
                CLEAR_DB + INSERT_USER + INSERT_MEALS,
                function (error, results, fields) {
                    connection.release()
                    if (error) throw error
                    logger.debug('beforeEach done')
                    done()
                }
            )
        })
    })
 
    it('TC-304-1 Maaltijd bestaat niet', (done) => {
        const nonExistingMealId = -1 
        const token = jwt.sign({ userId: 1 }, jwtSecretKey) 
   
        database.getConnection(function (err, connection) {
            if (err) return done(err)
            const query = 'SELECT id FROM meal WHERE id = ?'
            connection.query(query, [nonExistingMealId], function (error, results, fields) {
                connection.release()
                if (error) return done(error)
                if (results.length === 0) {
                    chai.request(server)
                        .get(`${endpointToTest}/${nonExistingMealId}`)
                        .set('Authorization', `Bearer ${token}`)
                        .end((err, res) => {
                            if (err) {
                                return done(err)
                            } else {
                                res.should.have.status(404)
                                done()
                            }
                           
                        })
                } else {
                    done({
                        error: `Meal with ID ${nonExistingMealId} exists in the database`
                        }
                    )
                }
            })
        })
    })
   
    it('TC-304-2 Details van maaltijd geretourneerd', (done) => {
        const token = jwt.sign({ userId: 1 }, jwtSecretKey)
 
        chai.request(server)
            .get(`${endpointToTest}/1`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                chai.expect(res).to.have.status(200)
                chai.expect(res.body).to.be.an('object')
                chai.expect(res.body).to.have.property('data')
                done()
            })
    })
})