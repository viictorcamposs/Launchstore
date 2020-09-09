const express = require ('express')
const routes = express.Router ()

const HomeController = require ('../app/controllers/HomeController')

const users = require('./users')
const products = require('./products')

routes  
.get ('/', HomeController.index)

.use('/users', users)
.use('/products', products)



routes // Alias
.get ('/ads/create', (req, res) => {
	return res.redirect('/products/create')
})

.get ('/accounts', (req, res) => {
	return res.redirect('/users/login')
})

module.exports = routes