const LoadService = require('../services/LoadProductService')

module.exports = {
    async index(req, res) {
        try {
            const getAllProducts = await LoadService.load('products')
            const products = getAllProducts
            .filter((product, index) => index > 2 ? false : true)
        
            return res.render('home/index', {products})
        } catch (error) {
            console.log (`Database Error => ${error}`)
        }
    }
}