const LoadService = require('../services/LoadProductService')
const User = require('../models/User')
const Order = require('../models/Order')

const mailer = require('../../lib/mailer')
const { formatPrice, date } = require('../../lib/utils')
const Cart = require('../../lib/cart')

const email = (seller, product, buyer) => `
<h2>Olá, ${seller.name}</h2>
<p>Você tem um novo pedido de compra para um de seus produtos.</p>

<p>Produto: ${product.name}</p>
<p>Preço: ${product.formatedPrice}</p>
<p>${product.img}</p>
<p><br/><br/></p>
<h3>Dados do comprador:</h3>
<p>${buyer.name}</p>
<p>${buyer.email}</p>
<p>${buyer.address}</p>
<p>${buyer.cep}</p>
<p><br/><br/></p>
<p><strong>Entre em contato com o comprador para finalizar a transação.</strong></p>
<p><br/><br/></p>
<p>Atenciosamente, Equipe Launchstore</p>
`

module.exports = {
    async index(req, res) {
        // PEGAR OS PEDIDOS DO USUÁRIO
        let orders = await Order.findAll({ where: { buyer_id: req.session.userId}})

        const getOrdersPromise = orders.map(async order => {
            // DETALHES DO PRODUTO
            order.product = await LoadService.load('products', {
                where: { id: order.product_id}
            })

            // DETALHES DO COMPRADOR 
            order.buyer = await User.findOne({
                where: { id: order.buyer_id }
            })

            // DETALHES DO VENDEDOR
            order.seller = await User.findOne({
                where: { id: order.seller_id }
            }) 

            // FORMATAÇÃO DE PREÇO
            order.formatedPrice = formatPrice(order.price) 
            order.formatedTotal = formatPrice(order.total) 

            // FORMATAÇÃO DO STATUS 
            const orderStatus = {
                open: 'Aberto',
                sold: 'Vendido',
                canceled: 'Cancelado'
            }

            order.formatedStatus = orderStatus[order.status]

            // FORMATAÇÃO DE ATUALIZAÇÃO
            const updatedAt = date(order.updated_at)
            const updatedDate = `${updatedAt.day}/${updatedAt.month}/${updatedAt.year}`
            order.formatedUpdatedAt = `${order.formatedStatus} em ${updatedDate} às ${updatedAt.hour}h${updatedAt.minutes}`

            return order
        })

        orders = await Promise.all(getOrdersPromise)

        return res.render('order/index', { orders })
    },
    async post(req, res) {
        try {
            // PEGAR OS PRODUTOS DO CARRINHO
            const cart = Cart.init(req.session.cart)

            // VERIFICAR SE TODOS OS PEDIDOS SÃO VÁLIDOS
            const buyer_id = req.session.userId
            const createOrdersPromise = cart.items
            .filter(item => item.product.user_id != buyer_id)
            .map(async item => {
                let { product, price: total, quantity } = item
                const { price, id: product_id, user_id: seller_id } = product
                const status = 'open'

                // CRIAR ORDEM DO PEDIDO
                const order = await Order.create({
                    seller_id,
                    buyer_id,
                    product_id,
                    seller_id,
                    price,
                    total,
                    quantity, 
                    status
                })

                // PEGAR DADOS DO PRODUTO
                product = await LoadService.load('product', {
                    where: {id: product_id}
                })

                // PEGAR DADOS DO VENDEDOR
                const seller = await User.findOne({where: {id: seller_id}})

                // PEGAR DADOS DO COMPRADOR
                const buyer = await User.findOne({where: {id: buyer_id}})

                // ENVIAR EMAIL COM DADOS DA COMPRA PARA O VENDEDOR
                await mailer.sendMail({
                    to: seller.email,
                    from: 'no-reply@launchstore.com.br',
                    subject: 'Novo pedido de compra',
                    html: email(seller, product, buyer)
                })

                return order

            })

            await Promise.all(createOrdersPromise)

            // LIMPAR CARRINHO
            delete req.session.cart
            Cart.init()

            // NOTIFICAR O USUÁRIO COM UMA MENSAGEM DE SUCESSO
            return res.render('order/success')
        } catch (error) {
            console.error(error)
            return res.render('order/error')
        }
    }
}