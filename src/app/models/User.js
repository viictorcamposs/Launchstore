const db = require ( '../../config/db' )
const { hash } = require('bcryptjs')

const Product = require('../models/Product')
const fs = require('fs')

module.exports = {
    async findOne (filters) {
        try {
            let query = `SELECT * FROM users`
    
            Object.keys(filters).map(key => {
                query = `${query} ${key}`
    
                Object.keys(filters[key]).map(field => {
                    query = `${query} ${field} = '${filters[key][field]}'`
                })
            })
    
            const results = await db.query(query)
            return results.rows[0] 
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async create(data) {
        try {
            const query = `
                INSERT INTO users (
                    name,
                    email,
                    password,
                    cpf_cnpj,
                    cep,
                    address
                ) VALUES ($1, $2, $3, $4, $5, $6) 
                RETURNING id
            `
            // criptografia de senhas
            const passwordHash = await hash(data.password, 8)

            const values = [
                data.name,
                data.email,
                passwordHash,
                data.cpf_cnpj.replace(/\D/g, ""),
                data.cep.replace(/\D/g, ""),
                data.address,
            ]

            const results = await db.query(query, values)
            return results.rows[0].id
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async update(id, fields) {
        try {
            let query = `UPDATE users SET`
        
            Object.keys(fields).map((key, index, array) => {
                if((index + 1) < array.length) {
                    query = `${query}
                        ${key} = '${fields[key]}',
                    `
                } else {
                    query = `${query}
                        ${key} = '${fields[key]}'
                        WHERE id = ${id}
                    `
                }
            })

            await db.query(query)
            return
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    },
    async delete(id) { 
        try {
            // Pegar todos os produtos
            let results = await db.query('SELECT * FROM products WHERE user_id = $1', [id])
            const products = results.rows
    
            // Pegar todas as imagens
            const allFilesPromise = products.map(product =>
                Product.files(product.id))
                
            let promiseResults = await Promise.all(allFilesPromise)
    
            // Rodar o delete do usuário no sistema
            await db.query('DELETE FROM users WHERE id = $1', [id])
    
            // Remover as imagens da pasta public
            promiseResults.map(results => {
                results.rows.map(file => {
                    try {
                        fs.unlinkSync(file.path)
                    } catch (error) {
                        console.log(`Database Error => ${error}`)
                    }
                })
            })
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    }
}