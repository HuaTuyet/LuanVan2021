const mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3308,
    user: 'root',
    password: '',
    database: 'mayanh'
});

connection.connect((err) => {
    if(err){
        throw err;
    }
});




module.exports = connection;