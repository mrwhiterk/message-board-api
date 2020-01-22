const express = require('express'),
  cors = require('cors'),
  app = express(),
  usersRouter = require('./routes/users'),
  postsRouter = require('./routes/posts')

require('dotenv').config()
require('./db')()
require('./passport')(app)

app
  .use(cors(), require('morgan')('dev'), express.json())
  .use('/api/users', usersRouter)
  .use('/api/posts', postsRouter)

module.exports = app
