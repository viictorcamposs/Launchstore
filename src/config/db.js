const { Pool } = require ( 'pg' )

module.exports = new Pool ({
    user: 'postgres',
    password: 'Victor@oliveira98',
    host: 'localhost',
    port: 5432,
    database: 'launchstoredb'
})