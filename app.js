const express = require('express')
const cors = require('cors')
const app = express()
const usersRouter = require('./routes/users')

require('dotenv').config()
require('./db')()
require('./passport')(app)

app
  .use(cors(), require('morgan')('dev'), express.json())
  .use('/api/users', usersRouter)

module.exports = app
