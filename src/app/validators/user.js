const User = require('../models/User')

async function post(req, res, next) {
    // Validando se todos os campos estão preenchidos
    const keys = Object.keys(req.body)
    for(key of keys) {
        if(req.body[key] == "") return res.render('user/register', {
            user: req.body,
            error: 'Por favor, preencha todos os campos.'
        })
    }

    // Validando se o usuário já existe
    let { email, cpf_cnpj, password, passwordRepeat } = req.body
    
    cpf_cnpj = cpf_cnpj.replace(/\D/g, "")   
    
    const user = await User.findOne({ 
        where: { email },
        or: { cpf_cnpj }
    })

    if(user) return res.render('user/register', {
        user: req.body,
        error: 'Usuário já cadastrado.'
    })

    // Validando se a senha e repetição são iguais
    if(password != passwordRepeat) return res.render('user/register', {
        user: req.body,
        error: 'Senhas não combinam.'
    })

    next()
}

module.exports = {
    post
}