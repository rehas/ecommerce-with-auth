const express = require('express')
const app = express()
const cors = require('cors')
const productsRouter = require('./products/router')
const usersRouter = require('./users/router')
const bodyParser = require('body-parser')
const {verify} = require('./jwt')
const User = require('./users/model')

app.use(cors())
app.use(bodyParser.json())

app.use(function (req, res, next) {
  // console.log("request headers within token cheker")
  // console.log(req.headers)
  if (!req.headers.authorization) return next()

  const auth = req.headers.authorization.split(' ')
  if (auth[0] === 'Bearer') {
    verify(auth[1], function (err, jwt) {
      if (err) {
        // console.error(err)
        res.status(400).send({
          message: "JWT token invalid"
        })
      }
      else {
        // console.log(jwt)
        User
          .findById(jwt.data.id)
          .then(entity => {
            req.user = entity
            next()
          })
          .catch(err => {
            // console.error(err)
            res.status(500).send({
              message: 'Something went horribly wrong'
            })
          })
      }
    })
  }
  else next()
})

app.use(productsRouter)
app.use(usersRouter)

app.listen(4001, () => console.log('Express API listening on port 4001'))