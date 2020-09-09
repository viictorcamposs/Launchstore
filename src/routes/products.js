const express = require ('express')
const routes = express.Router ()
const multer = require ('../app/middlewares/multer')

const ProductController = require ('../app/controllers/ProductController')
const SearchController = require ('../app/controllers/SearchController')

routes // search
.get('/search', SearchController.index)

routes // rotas dos produtos da minha plataforma
.get ('/create', ProductController.create)
.get ('/:id', ProductController.show)
.get ('/:id/edit', ProductController.edit)

.post ('/', multer.array('photos', 6), ProductController.post)
.put ('/', multer.array('photos', 6), ProductController.put)
.delete ('/', ProductController.delete)

module.exports = routes