const express = require ('express')
const routes = express.Router ()
const multer = require ('../app/middlewares/multer')

const ProductController = require ('../app/controllers/ProductController')
const SearchController = require ('../app/controllers/SearchController')

const Validator = require('../app/validators/product')

const { onlyUsers } = require('../app/middlewares/session')

routes // search
.get('/search', SearchController.index)

routes // rotas dos produtos da minha plataforma
.get ('/create', onlyUsers, ProductController.create)
.get ('/:id', ProductController.show)
.get ('/:id/edit', onlyUsers, ProductController.edit)

.post ('/', onlyUsers,multer.array('photos', 6), Validator.post, ProductController.post)
.put ('/', onlyUsers, multer.array('photos', 6), Validator.put, ProductController.put)
.delete ('/', onlyUsers, ProductController.delete)

module.exports = routes