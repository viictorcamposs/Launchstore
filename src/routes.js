const express = require ('express')
const routes = express.Router ()
const multer = require ('./app/middlewares/multer')

const ProductController = require ('./app/controllers/ProductController')
const HomeController = require ('./app/controllers/HomeController')
const SearchController = require ('./app/controllers/SearchController')

routes // rota da minha página inicial 
.get ('/', HomeController.index)

// search
.get('/products/search', SearchController.index)

routes // rotas dos produtos da minha plataforma
.get ('/products/create', ProductController.create)
.get ('/products/:id', ProductController.show)
.get ('/products/:id/edit', ProductController.edit)

.post ('/products', multer.array('photos', 6), ProductController.post)
.put ('/products', multer.array('photos', 6), ProductController.put)
.delete ('/products', ProductController.delete)

routes // shortcuts
.get ( '/ads/create', ( req, res ) => {
  return res.redirect ('/products/create')
})

module.exports = routes