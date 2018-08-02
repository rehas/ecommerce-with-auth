const Router = require('express').Router
const Product = require('./model')

const router = new Router()

const requireUser = (req, res, next) => {
  // console.log("RequireUser middleware")
  // console.log(req);
  
	if (req.user) next()
	else res.status(401).send({
		message: 'Please login to access product/add/edit/delete'
	})
}

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

router.post('/products', requireUser, (req, res)=>{
  const product = req.body
  product.userId = req.user.id
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

router.put('/products/:id', requireUser, (req, res) => {
  const productId = Number(req.params.id)
  const updates = req.body
  
  Product.findById(productId)
    .then(foundProduct =>{
      console.log(foundProduct.userId, "Foundproduct user_id")
      console.log(req.user.id, "req.user")
      if(foundProduct.userId !==req.user.id){
        res.status(403).send({
          message: `You're not allowed to edit thid product`
        })
      }else{
        foundProduct.update(updates)
      }
    })
    .then((result)=>{
          res.status(200).send(result)
      })
        .catch(err=> {
          console.log("update failed", err)
          res.status(204).send("Update failed")
      })
      .catch(error => res.status(500).send("No such product"))
    })

router.delete('/products/:id', requireUser, (req, res)=>{
  const productId = Number(req.params.id)
  
  Product.findById(productId)
    .then(foundProduct =>{
      if(foundProduct.userId!==req.user.id){
        res.status(403).send({
          message: `You don't own this product, you can't delete it`
        })
      }else{
        foundProduct.destroy()
        .then(result => res.status(200).send(`Product with Id: ${productId} deleted succesfully`))
      }
    })
    .catch(err => res.status(500).send("deletion failed"))
  })
  

module.exports = router