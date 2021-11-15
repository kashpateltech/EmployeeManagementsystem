const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port = 3001,
    user: 'root',
    database: 'employee_management_db'
})

module.exports = connection;