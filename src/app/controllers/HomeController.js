const Product = require('../models/Product')

const {formatPrice} = require('../../lib/utils')

module.exports = {
    async index(req, res) {
        try {
            const products = await Product.findAll()
            if(!products) return res.send('Products Not Found!')
    
            async function getImage(productId) {
                let files = await Product.files(productId)
                files = files.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)
                return files[0]
            }
    
            const ProductsPromise = products.map(async product => {
                product.img = await getImage(product.id)
                product.oldPrice = formatPrice(product.old_price)
                product.price = formatPrice(product.price) 
    
                return product
            }).filter((product, index) => index > 2 ? false : true)
    
            const lastAdded = await Promise.all(ProductsPromise)
    
            return res.render('home/index', {products: lastAdded})
        } catch (error) {
            console.log (`Database Error => ${error}`)
        }
    }
}