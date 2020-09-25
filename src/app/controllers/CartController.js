const Cart = require('../../lib/cart')

const LoadService = require('../services/LoadProductService')

module.exports = {
    async index(req, res) {
        try {
            // PEGAR O CARRINHO DA SESSÃO
            let { cart } = req.session

            // ATUALIZAR O CARRINHO (gerenciador do carrinho)
            cart = Cart.init(cart)

            // LEVAR PARA PÁGINA DO CARRINHO
            return res.render('cart/index', { cart })
        } catch (error) {
            console.error(error)
        }
    },
    async addOne(req, res) {
        try {
            // PEGAR O ID DO PRODUTO E O PRODUTO
            const { id } = req.params
            const product = await LoadService.load('product', {
                where: { id }
            })
    
            // PEGAR O CARRINHO DA SESSÃO
            let { cart } = req.session
    
            // ADICIONAR O PRODUTO AO CARRINHO (usando gerenciador de carrinho)
            cart = Cart.init(cart).addOne(product)
    
            // ATUALIZAR O CARRINHO DA SESSÃO
            req.session.cart = cart
    
            // REDIRECIONAR O USUÁRIO PARA A TELA DO CARRINHO
            return res.redirect('/cart')
        } catch (error) {
            console.error(error)
        }
    },
    async removeOne(req, res) {
        // PEGAR O ID DO PRODUTO
        let { id } = req.params

        // PEGAR O CARRINHO DA SESSÃO
        let { cart } = req.session

        // SE NÃO EXISTIR, RETORNAR
        if(!cart) return res.redirect('/cart')

        // INICIAR O CARRINHO (gerenciador de carrinho) E REMOVER
        cart = Cart.init(cart).removeOne(id)

        // ATUALIZAR O CARRINHO, REMOVENDO UM ITEM
        req.session.cart = cart

        // REDIRECIONAR PARA A PÁGINA CART
        return res.redirect('/cart')
    },
    delete(req, res) {
        const { id } = req.params
        let { cart } = req.session
        if(!cart) return 

        req.session.cart = Cart.init(cart).delete(id)

        return res.redirect('/cart')
    }
}