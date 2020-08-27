const express = require ('express')
const routes = express.Router ()
const ProductController = require ('./app/controllers/ProductController')

routes // rota da minha página inicial 
.get ('/', ( req, res ) => {
  return res.render ('layout.njk')
})

routes // rotas dos produtos da minha plataforma
.get ('/products/create', ProductController.create)
.get ('/products/:id/edit', ProductController.edit)
.post ('/products', ProductController.post)
.put ('/products', ProductController.put)
.delete ('/products', ProductController.delete)

routes // shortcuts
.get ( '/ads/create', ( req, res ) => {
  return res.redirect ('/products/create')
})

module.exports = routes