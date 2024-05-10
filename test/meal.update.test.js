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
 
describe('UC-302 Wijzigen van maaltijdgegevens', () => {
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

    it(`TC-302-1 Verplicht velden “name” en/of “price”en/of “maxAmountOfParticipants” ontbreken `, (done) => {
        chai.request(server)
            .put(`${endpointToTest}/1`)
            .set('Authorization', 'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey))
            .send({
                "description": "Pasta with saus",
                "isActive": 1,
                "isVegan": 0,
                "isToTakeHome": 1,
                "dateTime": "2023-04-06T10:27:16.849Z",
                "imageUrl": "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
                "allergenes": ["gluten", "lactose"]
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res.body).to.be.an('object')
                chai.expect(res.body).to.have.property('status').equals(400)
                chai.expect(res.body).to.have.property('data').that.is.an('object').that.is.empty
                done()
            })
    })

    it('TC-302-2 Niet ingelogd', (done) => {
        chai.request(server)
            .put(`${endpointToTest}/1`)
            .end((err, res) => {
                chai.expect(res).to.have.status(401)
                chai.expect(res.body).to.be.an('object')
                chai.expect(res.body).to.have.property('status').equals(401)
                chai.expect(res.body).to.have.property('message').equals('Authorization header missing!')
                chai.expect(res.body).to.have.property('data').that.is.an('object').that.is.empty
                done()
            })
    })

    it.skip('TC-302-3 Gebruiker is niet de eigenaar van de data', (done) => {
        chai.request(server)
            .put(`${endpointToTest}/2`)
            .set('Authorization', 'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey))
            .send({
                "name": "Pasta",
                "description": "Pasta with saus",
                "price": "12.50",
                "isActive": 1,
                "isVegan": 0,
                "isToTakeHome": 1,
                "dateTime": "2023-04-06T10:27:16.849Z",
                "maxAmountOfParticipants": "12",
                "imageUrl": "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
                "allergenes": ["gluten", "lactose"]
                
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(403)
                chai.expect(res.body).to.be.an('object')
                chai.expect(res.body).to.have.property('data').that.is.an('object').that.is.empty
                done()
            })
    })

    it.skip('TC-302-4 Maaltijd bestaat niet', (done) => {
        chai.request(server)
            .put(`${endpointToTest}/7`)
            .set('Authorization', 'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey))
            .send({
                "name": "Pasta",
                "description": "Pasta with saus",
                "price": "12.50",
                "isActive": 1,
                "isVegan": 0,
                "isToTakeHome": 1,
                "dateTime": "2023-04-06T10:27:16.849Z",
                "maxAmountOfParticipants": "12",
                "imageUrl": "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
                "allergenes": ["gluten", "lactose"]
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(404)
                chai.expect(res.body).to.be.an('object')
                chai.expect(res.body).to.have.property('status').equals(404)
                chai.expect(res.body).to.have.property('message').equals('Meal not found')
                chai.expect(res.body).to.have.property('data').that.is.an('object').that.is.empty
                done()
            })
    })

    it.skip('TC-305-5 Maaltijd succesvol gewijzigd', (done) => {
        chai.request(server)
            .put(`${endpointToTest}/1`)
            .set('Authorization', 'Bearer ' + jwt.sign({ userId: 1 }, jwtSecretKey))
            .send({
                name: "Pasta",
                description: "Pasta with saus",
                price: 12.50, 
                isActive: 1,
                isVegan: 0,
                isToTakeHome: 1,
                dateTime: "2023-04-06T10:27:16.849Z",
                maxAmountOfParticipants:12,
                imageUrl: "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
                allergenes: ["gluten", "lactose"]
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(200)
                chai.expect(res.body).to.be.an('object')
                chai.expect(res.body).to.have.property('status').equals(200)
                chai.expect(res.body).to.have.property('data').that.is.an('array').that.is.not.empty
                chai.expect(res.body.data[0]).to.have.property('name').equals('Pasta')
                chai.expect(res.body.data[0]).to.have.property('description').equals('Pasta with saus')
                chai.expect(res.body.data[0]).to.have.property('price').equals(12.50) 
                chai.expect(res.body.data[0]).to.have.property('isActive').equals(1)
                chai.expect(res.body.data[0]).to.have.property('isVegan').equals(0)
                chai.expect(res.body.data[0]).to.have.property('isToTakeHome').equals(1)
                chai.expect(res.body.data[0]).to.have.property('dateTime').equals('2023-04-06T10:27:16.849Z')
                chai.expect(res.body.data[0]).to.have.property('maxAmountOfParticipants').equals(12) 
                chai.expect(res.body.data[0]).to.have.property('imageUrl').equals('https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg')
                chai.expect(res.body.data[0]).to.have.property('allergenes').that.is.an('array').that.includes('gluten', 'lactose')
                done()
            })
    })





})