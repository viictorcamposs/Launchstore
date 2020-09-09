const express = require ('express')
const routes = express.Router ()

const SessionController = require ('../app/controllers/SessionController')
const UserController = require ('../app/controllers/UserController')

const Validator = require('../app/validators/user')

// routes // Login - Logout 
// .get('/login', SessionController.loginForm)
// .post('/login', SessionController.login)
// .post('/logout', SessionController.logout)

// routes // Reset Password - Forgot Password
// .get('/forgot-password', SessionController.forgotForm)
// .get('/reset-password', SessionController.resetForm)
// .post('/forgot-password', SessionController.forgot)
// .post('/reset-password', SessionController.reset)

routes // User Register
.get('/register', UserController.registerForm)
.post('/register', Validator.post, UserController.post)

.get('/', UserController.show)
// .put('/', UserController.update)
// .delete('/', UserController.delete)

module.exports = routes