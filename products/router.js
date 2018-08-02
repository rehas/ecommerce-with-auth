const Router = require('express').Router
const Product = require('./model')

const router = new Router()

router.get('/products', (req, res)=>{
  Product.findAll({
    attributes: ['id', 'name', 'price']
  })
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      // there was an error, return some HTTP error code
      res.status(404).send('Error getting products')
    })
})

router.post('/products', (req, res)=>{
  const product = req.body
  // console.log(product)
  // ... insert the new data into our database
  Product.create(product)
    .then((response)=>{
      console.log(response.dataValues)
      return  res.status(201).send(response.dataValues)
    } )
    .catch(error => res.status(404).send("product creation failed"))
})

router.get('/products/:id', (req, res)=>{
  Product.findById(req.params.id)
  .then(result => {
    if (!result.id){
      throw new Error("Product not found 1")
    }
    res.send(result)
  })
  .catch(err => {
    res.status(404).send("Product Not found")
  })
})

router.put('/products/:id', (req, res) => {
  const productId = Number(req.params.id)
  const updates = req.body
  
  Product.findById(productId)
    .then(foundProduct =>{
      foundProduct.update(updates)
        .then((result)=>{
          //console.log("Im the result from the update", result)
          res.status(200).send(result)
      })
        .catch(err=> {
          console.log("update failed", err)
          res.status(204).send("Update failed")
      })
    }).catch(error => res.status(500).send("No such product"))
  // find the product in the DB
  // change the product and store in DB
  // respond with the changed product and status code 200 OK
})

router.delete('/products/:id', (req, res)=>{
  const productId = Number(req.params.id)
  
  Product.findById(productId)
    .then(foundProduct =>{
      foundProduct.destroy()
        .then(result => res.status(200).send(`Product with Id: ${productId} deleted succesfully`))
        .catch(err => res.status(500).send("deletion failed"))
    })
    .catch(err => res.status(500).send("Product for deletion not found"))
})

module.exports = router