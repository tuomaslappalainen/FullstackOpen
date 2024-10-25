const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const userRouter = require('./controllers/users')
const notesRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

const connectToDatabase = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI);
        logger.info('Connected to MongoDB');
    } catch (error) {
        logger.error('Error connecting to MongoDB:', error.message);
    }
};
  
connectToDatabase();

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/users', userRouter)
app.use('/api/blogs', notesRouter)
app.use('/api/login', loginRouter)

app.use((request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  })

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
  }

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app