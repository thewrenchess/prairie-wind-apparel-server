const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT || 8000

const api_routes = require('./routes')

const app = express()

// middleware
app.use(morgan('dev'))
app.use(cors())

// routes
app.use('/api', api_routes)

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send({ error: err })
})

app.listen(PORT, () => {
  console.log(`Listening on localhost:${PORT}`)
})
