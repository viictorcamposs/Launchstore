const { hash } = require('bcryptjs')
const { unlinkSync } = require('fs')

const User = require('../models/User')
const Product = require('../models/Product')

module.exports = {
    registerForm(req, res) {
        return res.render('user/register')
    },
    show(req, res) {
        try {
            const { user } = req
    
            user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
            user.cep = formatCep(user.cep)
    
            return res.render('user/index', { user })
        } catch (error) {
            console.error(error)
        }
    },
    async post(req, res) {
        try {
            let { name, email, password, cpf_cnpj, cep, address } = req.body
            
            password = await hash(password, 8)
            cpf_cnpj.replace(/\D/g, "")
            cep.replace(/\D/g, "")
            
            const userId = await User.create({
                name,
                email,
                password,
                cpf_cnpj,
                cep,
                address
            })

            req.session.userId = userId
            
            return res.redirect('/users')
        } catch (error) {
            console.error(error)
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
            console.error(error)
            return res.render('user/index', {
                error: 'Ops! Alguma coisa deu errado! :('
            })
        }
    },
    async delete(req, res) {
        try {
            const products = await Product.findAll({ where: { user_id: req.body.id}})
    
            // Pegar todas as imagens
            const allFilesPromise = products.map(product =>
                Product.files(product.id))
                
            let promiseResults = await Promise.all(allFilesPromise)
    
            // Rodar o delete do usuário no sistema
            await User.delete(req.body.id)
            req.session.destroy()
    
            // Remover as imagens da pasta public
            promiseResults.map(results => {
                results.rows.map(file => {
                    try {
                        unlinkSync(file.path)
                    } catch (error) {
                        console.error(error)
                    }
                })
            })

            return res.render('session/login', {
                success: "Conta deletada com sucesso!"
            })

        } catch (error) {
            console.error(error)
            return res.render('user/index', {
                user: req.body,
                error: "Não foi possível deletar sua conta!"
            })
        }
    }
}