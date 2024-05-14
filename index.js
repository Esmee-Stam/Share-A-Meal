const express = require('express')
const userRoutes = require('./src/routes/user.routes')
const authRoutes = require('./src/routes/authentication.routes').routes
const mealsRoutes = require('./src/routes/meal.routes')
const logger = require('./src/util/logger')

const app = express()

// express.json zorgt dat we de body van een request kunnen lezen
app.use(express.json())

const port = process.env.PORT || 3000

// Dit is een voorbeeld van een simpele route
app.get('/api/info', (req, res) => {
    logger.info('GET /api/info')
    const info = {
        studentName: 'Esmée Stam',
        studentNumber: '2196911',
        description: 'This is a simple Nodejs Express server, where users can offer meals to be shared with others. Users can log in. There is an option to create, read, update and delete users and meals'
        }
    res.json(info)
})

// Hier komen alle routes
app.use(userRoutes)
app.use(authRoutes)
app.use(mealsRoutes)
// Route error handler
app.use((req, res, next) => {
    next({
        status: 404,
        message: 'Route not found',
        data: {}
    })
})

// Hier komt je Express error handler te staan!
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        status: error.status || 500,
        message: error.message || 'Internal Server Error',
        data: {}
    })
})

const server = app.listen(port, () => {
    const host = server.address().address
    const port = server.address().port
    logger.info(`Server is running on ${host}:${port}`)
})

// Deze export is nodig zodat Chai de server kan opstarten
module.exports = app
