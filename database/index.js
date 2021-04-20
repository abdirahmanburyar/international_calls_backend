const {
    MYSQL_DB,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_HOST
} = process.env
const mysql = require('mysql');

const conn  = mysql.createConnection({
        port: MYSQL_PORT,
        database: MYSQL_DB,
        host: MYSQL_HOST,
        password: MYSQL_PASSWORD,
        user: MYSQL_USER,
        multipleStatements: true
    })


module.exports = conn