const User = require('../models/User')
const { compare } = require('bcryptjs')

async function login(req, res, next) {
    try {
        const { email, password } = req.body
    
        const user = await User.findOne({ where: { email } })
        if(!user) return res.render('session/login', {
            user: req.body,
            error: "Usuário não cadastrado!"
        })
    
        // Password match
        const passed = await compare(password, user.password)
        if(!passed) return res.render('session/login', {
            user: req.body,
            error: 'Senha incorreta.'
        })
    
        req.user = user
    
        next()
    } catch (error) {
        console.log(`Database Error => ${error}`)
    }
}
async function forgot(req, res, next) {
    const { email } = req.body
    
    try {
        let user = await User.findOne({ where: { email } })
        
        if(!user) return res.render('session/forgot-password', {
            user: req.body,
            error: "Email não cadastrado!"
        })

        req.user = user

        next()
    } catch (error) {
        console.log(`Database Error => ${error}`)
    }
}
async function reset(req, res, next) {
    const { email, password, passwordRepeat, token } = req.body

    // Procurar usuário
    const user = await User.findOne({ where: { email } })
    if(!user) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: "Usuário não cadastrado!"
    })

    // Verificar combinação de senhas
    if(password != passwordRepeat) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'Senhas não combinam.'
    })

    // Validar token
    if(token != user.reset_token) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'Token inválido. Solicite uma nova recuperação de senha.'
    })

    // Validar tempo do token
    let now = new Date()
    now = now.setHours(now.getHours())

    if(now > user.reset_token_expires) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'Tempo de validação do token expirou. Por favor, solicite uma nova recuperação de senha.'
    })

    req.user = user

    next()
}

module.exports = {
    login,
    forgot,
    reset
}