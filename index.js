const express = require('express')
const app = express()
const cors = require('cors')
const productsRouter = require('./products/router')
const usersRouter = require('./users/router')
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())
app.use(productsRouter)
app.use(usersRouter)

app.listen(4001, () => console.log('Express API listening on port 4001'))