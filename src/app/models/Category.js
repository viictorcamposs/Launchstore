const db = require ( '../../config/db' )

module.exports = {
    all () {
        try {
            return db.query (`
                SELECT * FROM categories 
            `)
        } catch (error) {
            console.log(`Database Error => ${error}`)
        }
    }
}