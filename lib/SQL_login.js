const mysql = require('mysql2');

const connection = mysql.createConnection(
{
    multipleStatements: true,
    host: 'localhost',
    user: 'root',
    port: 3306,
    database: 'Employee_Management_db',
    password: ''
    
})

module.exports = connection;