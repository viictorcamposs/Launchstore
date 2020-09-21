const Product = require('../models/Product')
const LoadService = require('../services/LoadProductService')

module.exports = {
    async index(req, res) { 
        try {
            let {filter, category} = req.query
            
            if(!filter || filter.toLowerCase() == 'toda a loja') filter = null

            let products = await Product.search({filter, category})
            const ProductsPromise = products.map(LoadService.format)
            products = await Promise.all(ProductsPromise)

            const search = {
                term: filter || 'Toda a loja',
                total: products.length
            }
            const categories = products.map(product => ({
                id: product.category_id,
                name: product.category_name
            })).reduce((categoriesFiltered, category) => {
                const found = categoriesFiltered.some(cat => cat.id == category.id)

                if(!found) categoriesFiltered.push(category)

                return categoriesFiltered
            }, [])
    
            return res.render('search/index', {products, search, categories}) 
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    }
}