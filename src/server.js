const nunjucks = require ('nunjucks')
const express = require ('express')
const routes = require ('./routes')
const methodOverride = require ('method-override')
const session = require('./config/session')

const server = express ()
 
server
.use(session)
.use((req, res, next) => {
  res.locals.session = req.session
  next()
}) 
.use (express.urlencoded ( { extended: true } ))
.use (express.static ('public'))
.use (methodOverride ('_method'))
.use (routes)

.set ('view engine', 'njk')

nunjucks.configure ('src/app/views', {
  express: server,
  autoescape: false,
  noCache: true
})

server.listen (5000, () => {
  console.log ('Server is Running')
})