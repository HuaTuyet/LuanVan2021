const db = require('../Database');

//Lấy danh sách mã giảm giá chưa bị xóa vào thùng rác
exports.list = function(){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM  magiamgia WHERE deletedAt IS NULL";
        db.query(sql, function(err,result){
            if(err){
                reject(err);
            }
            resolve(result);
        });
    })
}

//Đếm số mã giảm giá đã bị xóa
exports.countDeleted = function(){
    return new Promise((resolve, reject) =>{
        let sql = 'SELECT COUNT(deletedAt) AS deletedCount FROM magiamgia';
        db.query(sql, function(err,result){
            if(err)  {
                reject(err);
            }
            resolve(result);
        });
    })
}

//Lấy danh sách mã giảm giá đã bị xóa vào thùng rác
exports.listTrash = function(){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM magiamgia WHERE deletedAt IS NOT NULL";
        db.query(sql, function(err,result){
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
}

//Thêm mã giảm giá
exports.create = function(coupon){
    let sql = "INSERT INTO magiamgia SET ?";
    db.query(sql, coupon, function(err, result){
        if(err) {
            return console.error('err them magg: ' + err.message);
        }
    });
}

//Kiểm tra khóa bên req có tồn tại trong cơ sở dữ liệu chưa (kiểm tra trước khi thêm)
exports.findId = function(idCoupon, callbackDetail){
    let sql = "SELECT magg FROM magiamgia WHERE magg = ?";
    db.query(sql, idCoupon, function(err, result){
        if(err){
            return console.error('err find id: ' + err.message);
        }
        callbackDetail(result);
    })
}

//Lấy thông tin mã giảm giá theo mã
exports.detail = function(idCoupon){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM magiamgia WHERE magg = ?";
        db.query(sql, idCoupon, function(err, result){
            if(err){
                reject(err);
            }
            resolve(result);
        });
    })
}

//Cập nhật thông tin mã giảm giá
exports.update = function(coupon, idCoupon){
    let sql = 'UPDATE magiamgia SET ? WHERE magg = ?';
    db.query(sql, [coupon, idCoupon], function (err, result){
        if(err)  {
            return console.error('err cap nhat: ' + err.message);
        }
    });
}

//Xóa thương hiệu sản phẩm vào thùng rác
exports.delete = function (date, idCoupon){
    let sql = 'UPDATE magiamgia SET deletedAt = ? WHERE magg = ?';
    db.query(sql, [date, idCoupon], function (err, result){
        if(err) {
            return console.error('err delete magiamgiam: ' + err.message);
        }
    })
}

//Kiểm tra khóa có tồn tại một sản phẩm nào không (kiểm tra trước khi xóa)
exports.findFK = function(idCoupon, callbackFK){
    let sql = "SELECT masp FROM sanpham WHERE magg = ? LIMIT 1";
    db.query(sql, idCoupon, function(err, result){
        if(err){
            return console.error('err FK xoa: ' + err.message);
        }
        callbackFK(result);
    })
}

//Khôi phục thương hiệu ra khỏi thùng rác
exports.restore = function (date, idCoupon){
    let sql = 'UPDATE magiamgia SET deletedAt = ? WHERE magg = ?';
    db.query(sql, [date, idCoupon], function (err, result){
        if(err)  {
            return console.error('err khoi phuc: ' + err.message);
        }
    })
}

//Xóa vĩnh viễn
exports.forceDelete = function (idCoupon){
    let sql = 'DELETE FROM magiamgia WHERE magg = ?';
    db.query(sql, idCoupon, function (err, result){
        if(err)  {
            return console.error('err xoa vinh vien: ' + err.message);
        }
    })
}