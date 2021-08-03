const db = require('../Database');

//Lấy danh sách nhà cung cấp chưa bị xóa vào thùng rác
exports.list = function(){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM  nhacungcap WHERE deletedAt IS NULL";
        db.query(sql, function(err,result){
            if(err){
                reject(err);
            }
            resolve(result);
        });
    })
}

//Đếm số nhà cung cấp đã bị xóa
exports.countDeleted = function(){
    return new Promise((resolve, reject) =>{
        var sql = 'SELECT COUNT(deletedAt) AS deletedCount FROM nhacungcap';
        db.query(sql, function(err,result){
            if(err)  {
                reject(err);
            }
            resolve(result);
        });
    })
}

//Lấy danh sách nhà cung cấp đã bị xóa vào thùng rác
exports.listTrash = function(){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM nhacungcap WHERE deletedAt IS NOT NULL";
        db.query(sql, function(err,result){
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
}

//Thêm nhà cung cấp
exports.create = function(provider){
    var sql = "INSERT INTO nhacungcap SET ?";
    db.query(sql, provider, function(err, result){
        if(err) {
            return console.error('err them TH: ' + err.message);
        }
    });
}

//Kiểm tra khóa bên req có tồn tại trong cơ sở dữ liệu chưa (kiểm tra trước khi thêm)
exports.findId = function(idProvider, callbackDetail){
    var sql = "SELECT mancc FROM nhacungcap WHERE mancc = ?";
    db.query(sql, idProvider, function(err, result){
        if(err){
            return console.error('err find khoa ngoai: ' + err.message);
        }
        callbackDetail(result);
    })
}

//Lấy thông tin nhà cung cấp theo mã
exports.detail = function(idProvider){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM nhacungcap WHERE mancc = ?";
        db.query(sql, idProvider, function(err, result){
            if(err){
                reject(err);
            }
            resolve(result);
        });
    })
}

//Cập nhật thông tin nhà cung cấp
exports.update = function(provider, idProvider){
    var sql = 'UPDATE nhacungcap SET ? WHERE mancc = ?';
    db.query(sql, [provider, idProvider], function (err, result){
        if(err)  {
            return console.error('err cap nhat: ' + err.message);
        }
    });
}

//Xóa nhà cung cấp vào thùng rác
exports.delete = function (date, idProvider){
    var sql = 'UPDATE nhacungcap SET deletedAt = ? WHERE mancc = ?';
    db.query(sql, [date, idProvider], function (err, result){
        if(err) {
            return console.error('err delete nha cung cap: ' + err.message);
        }
    })
}

//Kiểm tra khóa có tồn tại một sản phẩm nào không (kiểm tra trước khi xóa)
exports.findFK = function(idProvider, callbackFK){
    var sql = "SELECT mapn FROM phieunhap WHERE mancc = ? LIMIT 1";
    db.query(sql, idProvider, function(err, result){
        if(err){
            return console.error('err FK xoa nha cung cap: ' + err.message);
        }
        callbackFK(result);
    })
}

//Khôi phục thương hiệu ra khỏi thùng rác
exports.restore = function (date, idProvider){
    var sql = 'UPDATE nhacungcap SET deletedAt = ? WHERE mancc = ?';
    db.query(sql, [date, idProvider], function (err, result){
        if(err)  {
            return console.error('err khoi phuc: ' + err.message);
        }
    })
}

//Xóa vĩnh viễn
exports.forceDelete = function (idProvider){
    var sql = 'DELETE FROM nhacungcap WHERE mancc = ?';
    db.query(sql, idProvider, function (err, result){
        if(err)  {
            return console.error('err xoa vinh vien: ' + err.message);
        }
    })
}