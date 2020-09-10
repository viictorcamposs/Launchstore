const { formatPrice, date } = require ('../../lib/utils')

const Category = require ('../models/Category')
const Product = require ('../models/Product')
const File = require ('../models/File')

 
module.exports = {
    async create ( req, res ) {
        try {
            // pegar categorias 
            let results = await Category.all ()
            const categories = results.rows
                
            return res.render ( 'products/create.njk', { categories } )
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async post ( req, res ) { 
        try {
            // lógica de salvar 
            const keys = Object.keys ( req.body )
            for ( key of keys ) {
                if ( req.body[key] == "" ) return res.send ( 'Por favor, preencha todos os campos!' )
            }

            if ( req.files.length == 0 ) return res.send ('Por favor, envie pelo menos uma imagem!')

            req.body.user_id = req.session.userId

            let results = await Product.create ( req.body )
            const productId = results.rows[0].id

            const filePromises = req.files.map ( file => File.create ({ ...file, product_id: productId }))
            await Promise.all ( filePromises )

            return res.redirect (`/products/${ productId }/edit`)
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async show ( req, res ) {
        try {
            let results = await Product.find ( req.params.id )
            const product = results.rows[0]
    
            if ( !product ) return res.send ('Produto não encontrado!')
    
            const { day, hour, minutes, month } = date ( product.updated_at ) 
            product.published = {
                day: `${ day }/${ month }`,
                hour: `${ hour }h${ minutes }`,
                minutes,
                month
            }
            product.old_price = formatPrice ( product.old_price )
            product.price = formatPrice ( product.price )
    
            results = await Product.files ( product.id )
            const files = results.rows.map ( file => ({
                ...file,
                src: `${ req.protocol }://${ req.headers.host }${ file.path.replace ('public', '') }`
            }))
    
            return res.render ('products/show.njk', { product, files })
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async edit ( req, res ) {
        try {
            let results = await Product.find ( req.params.id )
            const product = results.rows[0]
        
            if ( !product ) return res.send ('Produto não encontrado! Por favor, verifique se as informações estão corretas, caso o erro continue persistindo, entre em contato com um dos nossos colaboradores.')
            
            product.old_price = formatPrice ( product.old_price )
            product.price = formatPrice ( product.price )
            
            // get categories 
            results = await Category.all ()
            const categories = results.rows
            
            // get images 
            results = await Product.files ( product.id )
            let files = results.rows
            files = files.map ( file => ({
                ...file,
                src: `${ req.protocol }://${ req.headers.host }${ file.path.replace ("public", "") }`
            }))
    
            return res.render ( 'products/edit.njk', { product, categories, files })
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async put ( req, res ) {
        try {     
            const keys = Object.keys ( req.body )
            for ( key of keys ) {
                if ( req.body[key] == "" && key != "removed_files" ) return res.send ( 'Por favor, preencha todos os campos!' )
            }
    
            if ( req.files.length != 0 ) {
                const newFilesPromise = req.files.map ( file => File.create ({ ...file, product_id: req.body.id })) 
                await Promise.all ( newFilesPromise )
            } 
    
            if ( req.body.removed_files ) {
                const removedFiles = req.body.removed_files.split (',')
                const lastIndex = removedFiles.length - 1
                
                removedFiles.splice ( lastIndex, 1 ) 
    
                const removedFilesPromise = removedFiles.map ( id => File.delete ( id ))
                await Promise.all ( removedFilesPromise )
            }
    
            req.body.price = req.body.price.replace (/\D/g, "")
            if ( req.body.old_price != req.body.price ) {
                const oldProduct = await Product.find ( req.body.id )
                req.body.old_price = oldProduct.rows[0].price
            }
    
            await Product.update ( req.body )
    
            return res.redirect (`/products/${ req.body.id }`)
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async delete ( req, res ) {
        try {
            await File.delete(req.body.id)
            await Product.delete ( req.body.id )
            return res.redirect ('/products/create')
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    }
}