const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const { hash } = require('bcryptjs')
const User = require('../models/User')

module.exports = {
    loginForm(req, res) {
        return res.render('session/login')    
    },
    login(req, res) {
        req.session.userId = req.user.id

        return res.redirect('/')
    },
    logout(req, res) {
        req.session.destroy()

        return res.redirect('/')
    },
    forgotForm(req, res) {
        return res.render('session/forgot-password')
    },
    async forgot(req, res) {
        try {
            const user = req.user 
    
            // criar token para o usuário
            const token = crypto.randomBytes(20).toString("hex")
    
            // criar expiração
            let now = new Date()
            now = now.setHours(now.getHours() + 1)
    
            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })
    
            // enviar email com o link de recuperação de senha e token
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@launchstore.com',
                subject: 'Recuperação de Senha',
                html: `
                    <h2>Falaaaa, ${user.name}</h2>
                    <p>Solicitou a recuperação de senha?</p>
                    <p>Não se preocupe, já estamos te enviando o link para fazer a troca.</p>
                    <p>
                        <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
                            Clique no link para poder recuperar a senha.
                        </a>
                    </p>
                ` 
            })
    
            // avisar o usuário que enviamos o email
            return res.render('session/forgot-password', {
                success: "Enviamos o link. Verifique seu email para resetar a senha."
            })
        } catch (error) {
            console.log(`Database Error => ${error}`)
            res.render('session/forgot-password', {
                error: "Tente novamente."
            })
        }
    },
    resetForm(req, res) {
        return res.render('session/password-reset', { token: req.query.token })
    },
    async reset(req, res) {
        const user = req.user
        const { password, token } = req.body

        try {
            // Criar nova criptografia de senha
            const newPassword = await hash(password, 8)

            // Atualizar usuário
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""
            })

            // Avisar usuário que deu tudo certo e ele tem uma nova senha
            return res.render('session/login', {
                user: req.body,
                success: "Senha atualizada com sucesso."
            })
            
        } catch (error) {
            console.log(`Database Error => ${error}`)
            res.render('session/password-reset', {
                user: req.body,
                token,
                error: "Tente novamente."
            })
        }
    }
}