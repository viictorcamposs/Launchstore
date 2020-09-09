const express = require ('express')
const routes = express.Router ()

const SessionController = require ('../app/controllers/SessionController')
const UserController = require ('../app/controllers/UserController')

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')

const { isLoggedRedirectToUsers, onlyUsers } = require('../app/middlewares/session')

routes // Login - Logout 
.get('/login', isLoggedRedirectToUsers, SessionController.loginForm)
.post('/login', SessionValidator.login, SessionController.login)
.post('/logout', SessionController.logout)

// routes // Reset Password - Forgot Password
// .get('/forgot-password', SessionController.forgotForm)
// .get('/reset-password', SessionController.resetForm)
// .post('/forgot-password', SessionController.forgot)
// .post('/reset-password', SessionController.reset)

routes // User Register
.get('/register', UserController.registerForm)
.post('/register', UserValidator.post, UserController.post)

.get('/', onlyUsers, UserValidator.show, UserController.show)
.put('/', onlyUsers, UserValidator.update,UserController.update)
// .delete('/', UserController.delete)

module.exports = routes