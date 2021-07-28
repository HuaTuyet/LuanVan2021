const db = require('../Database');

exports.getAdmin = function(email, callbackAdmin){
    var sql = 'SELECT * FROM admin WHERE email = ?';
    db.query(sql, email, function(err, result) {
        if(err){
            return console.error('err: ' + err.message);
        }
        callbackAdmin(result);
    })
}