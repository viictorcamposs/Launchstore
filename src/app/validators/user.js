const User = require('../models/User')
const { compare } = require('bcryptjs')

function checkIfContainAllFields(body) {
    // Validando se todos os campos estão preenchidos
    const keys = Object.keys(body)
    for(key of keys) {
        if(body[key] == "") {
            return {
                user: body,
                error: 'Por favor, preencha todos os campos.'
            }
        }
    }
}

async function post(req, res, next) {
    try {
        const checkTheFields = checkIfContainAllFields(req.body)
        if(checkTheFields) {
            return res.render('user/register', checkTheFields)
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
    } catch (error) {
        console.log(`Database Error => ${error}`)
    }
}
async function show(req, res, next) {
    try {
        const { userId: id } = req.session
    
        const user = await User.findOne({ where: { id } })
        if(!user) return res.render('user/register', {
            error: "Usuário não encontrado!"
        })
    
        req.user = user
    
        next()
    } catch (error) {
        console.log(`Database Error => ${error}`)
    }
}
async function update(req, res, next) {
    try {
        // All fields
        const checkTheFields = checkIfContainAllFields(req.body)
        if(checkTheFields) {
            return res.render('user/index', checkTheFields)
        }
    
        // Has password
        const { id, password } = req.body
        if(!password) return res.render('user/index', {
            user: req.body,
            error: "Coloque sua senha para atualizar seu cadastro."
        })
    
        // Password match
        const user = await User.findOne({ where: { id }})
        const passed = await compare(password, user.password)
        if(!passed) return res.render('user/index', {
            user: req.body,
            error: 'Senha incorreta.'
        })
    
        req.user = user
    
        next()
    } catch (error) {
        console.log(`Database Error => ${error}`)
    }
}

module.exports = {
    post,
    show,
    update
}