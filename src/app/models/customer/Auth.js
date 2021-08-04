const db = require('../Database');

//Kiểm tra email đã tồn tại trên database hay không
exports.checkEmail = function(email, callbackEmail) {
    var sql = 'SELECT * FROM  taikhoan WHERE email = ?';
    db.query(sql, email, function(err, result) {
        if(err){
            return console.error('err: ' + err.message);
        }
        callbackEmail(result);
    })
}

exports.checkEmailUpdate = function(tentk, callbackEmail) {
    var sql = 'SELECT email FROM  taikhoan WHERE tentk != ?';
    db.query(sql, tentk, function(err, result) {
        if(err){
            return console.error('err: ' + err.message);
        }
        callbackEmail(result);
    })
}
//Kiểm tra tên tài khoản đã tồn tại trên database hay không
exports.checkTentk = function(tentk, callback) {
    var sql = 'SELECT tentk FROM  taikhoan WHERE tentk = ?';
    db.query(sql, tentk, function(err, result) {
        if(err){
            return console.error('err: ' + err.message);
        }
        callback(result);
    })
}

//Tạo tài khoản khách hàng
exports.create = function(user){
    var sql = 'INSERT INTO taikhoan SET ?';
    db.query(sql, user, function(err, result){
        if(err) {
            return console.error('err: ' + err.message);
        }
    });
}

//Cập nhật tài khoản khách hàng
exports.update = function(user, callback){
    var sql = 'UPDATE taikhoan SET email = ?, sodt = ?, diachi = ?, anhdd = ? WHERE tentk = ?';
    db.query(sql, user, function(err, result){
        if(err) {
            return console.error('err: ' + err.message);
        }
        console.log('Rows affected:', result.affectedRows);
        callback(result.affectedRows);
    });
}

//Lấy tài khoản theo email
exports.getUsers = function(email, callbackUser){
    var sql = 'SELECT * FROM taikhoan WHERE email = ?';
    db.query(sql, email, function(err, result) {
        if(err){
            return console.error('err: ' + err.message);
        }
        callbackUser(result);
    })
}
//Lấy tài khoản theo tentk
exports.getUsersByTentk = function(tentk, callbackUser){
    var sql = 'SELECT * FROM taikhoan WHERE tentk = ?';
    db.query(sql, tentk, function(err, result) {
        if(err){
            return console.error('err: ' + err.message);
        }
        callbackUser(result[0]);
    })
}

//Đổi mật khẩu
exports.changePassword = function(matkhau, tentk, callbackUser){
    var sql = "UPDATE taikhoan SET matkhau = ? WHERE tentk = ?";
    db.query(sql, [matkhau,tentk], function(err, result) {
        if(err){
            return console.error('err: ' + err.message);
        }
        callbackUser(result.affectedRows);
    })
}

//Cập nhật token
exports.updateToken = function(token, tentk){
    var sql = "UPDATE taikhoan SET token = ? WHERE tentk = ?";
    db.query(sql, [token ,tentk], function(err, result) {
        if(err){
            return console.error('err: ' + err.message);
        }
        console.log(result.affectedRows);
    })
}
exports.getUserToken = function(token, callbackUser){
    var sql = "SELECT * FROM taikhoan WHERE token = ?";
    db.query(sql, token, function(err, result) {
        if(err){
            return console.error('err: ' + err.message);
        }
        callbackUser(result);
    })
}