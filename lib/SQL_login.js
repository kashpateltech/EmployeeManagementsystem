const mysql = require('mysql2');

const connection = mysql.createConnection(
{
    multipleStatements: true,
    host: 'localhost',
    user: 'root',
    port: 3306,
    database: 'employeemanagement_db',
    password: 'Tabcorp79'
    
});

module.exports = connection;