const User = require('../models/User')

module.exports = {
    registerForm(req, res) {
        return res.render('user/register')
    },
    show(req, res) {
        return res.send('OK! Cadastrado.')
    },
    async post(req, res) {
        try {
            // Vai ser usado depois para redirecionar para página de usuário
            const userId = await User.create(req.body) 
            
            return res.redirect('/users')
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    }
}