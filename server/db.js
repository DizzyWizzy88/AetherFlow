const mysql = require('mysql2')
const dotenv = require('dotenv')

dotenv.config()

// create a connection pool instead of single connection
// pools handle multiple requests better
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
})

// test the connection when server starts
pool.getConnection((err, connection) => {
    if (err) {
        console.error('database connection failed:', err.message)
        return
    }
    console.log('connected to mysql database')
    connection.release()
})

module.exports = pool.promise()
