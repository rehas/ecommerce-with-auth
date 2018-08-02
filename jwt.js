const secret = process.env.JWT_SECRET || 'JWT_~secret*\\key'
const jwt = require('jsonwebtoken')

 const sign = (userId) => {
   return jwt.sign(
        { data:{
          id: userId}},
          secret, 
          {
            expiresIn: '1h'
          }
  );
}

 const verify = (token, callback) => {
  jwt.verify(token, secret, callback)
}

module.exports = { sign, verify }