const Order = require('../models/Order')
const User = require('../models/User')
const LoadProductService = require('./LoadProductService')

const { formatPrice, date } = require('../../lib/utils')

async function format(order) {
    // DETALHES DO PRODUTO
    order.product = await LoadProductService.load('productWithDeleted', {
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
}

const LoadService = {
    load(service, filter) {
        this.filter = filter
        return this[service]()
    },
    async order() {
        try {
            const order = await Order.findOne(this.filter)
            return format(order)
        } catch (error) {
            console.error(error)
        }
    },
    async orders() {
        try {
            let orders = await Order.findAll(this.filter)
            const OrdersPromise = orders.map(format)

            return Promise.all(OrdersPromise)
        } catch (error) {
            console.error(error)
        }
    },
    format
}

module.exports = LoadService