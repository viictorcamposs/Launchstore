const User = require('../models/User')
const { formatCep, formatCpfCnpj } = require('../../lib/utils')

module.exports = {
    registerForm(req, res) {
        return res.render('user/register')
    },
    show(req, res) {
        const { user } = req

        user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
        user.cep = formatCep(user.cep)

        return res.render('user/index', { user })
    },
    async post(req, res) {
        try {
            // Vai ser usado depois para redirecionar para página de usuário
            const userId = await User.create(req.body) 

            req.session.userId = userId
            
            return res.redirect('/users')
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async update(req, res) {
        try {
            const { user } = req
            let { name, email, cpf_cnpj, cep, address } = req.body
            
            cpf_cnpj = cpf_cnpj.replace(/\D/g, '')
            cep = cep.replace(/\D/g, '')

            await User.update(user.id, {
                name, 
                email, 
                cpf_cnpj,
                cep,
                address
            })

            return res.render('user/index', {
                user: req.body,
                success: "Conta atualizada com sucesso!"
            })
        } catch (error) {
            console.log(`Database Error => ${error}`)
            return res.render('user/index', {
                error: 'Ops! Alguma coisa deu errado! :('
            })
        }
    },
    async delete(req, res) {
        try {
            await User.delete(req.body.id)
            req.session.destroy()

            return res.render('session/login', {
                success: "Conta deletada com sucesso!"
            })

        } catch (error) {
            console.log(`Database Error => ${error}`)
            return res.render('user/index', {
                user: req.body,
                error: "Não foi possível deletar sua conta!"
            })
        }
    }
}