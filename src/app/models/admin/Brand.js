const db = require('../Database');

//Lấy danh sách thương hiệu chưa bị xóa vào thùng rác
exports.list = function(){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM  thuonghieu WHERE deletedAt IS NULL";
        db.query(sql, function(err,result){
            if(err){
                reject(err);
            }
            resolve(result);
        });
    })
}

//Đếm số thương hiệu đã bị xóa
exports.countDeleted = function(){
    return new Promise((resolve, reject) =>{
        var sql = 'SELECT COUNT(deletedAt) AS deletedCount FROM thuonghieu';
        db.query(sql, function(err,result){
            if(err)  {
                reject(err);
            }
            resolve(result);
        });
    })
}

//Lấy danh sách thương hiệu đã bị xóa vào thùng rác
exports.listTrash = function(){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM thuonghieu WHERE deletedAt IS NOT NULL";
        db.query(sql, function(err,result){
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
}

//Thêm thương hiệu sản phẩm
exports.create = function(brand){
    var sql = "INSERT INTO thuonghieu SET ?";
    db.query(sql, brand, function(err, result){
        if(err) {
            return console.error('err them TH: ' + err.message);
        }
    });
}

//Kiểm tra khóa bên req có tồn tại trong cơ sở dữ liệu chưa (kiểm tra trước khi thêm)
exports.findId = function(idBrand, callbackDetail){
    var sql = "SELECT math FROM thuonghieu WHERE math = ?";
    db.query(sql, idBrand, function(err, result){
        if(err){
            return console.error('err find id: ' + err.message);
        }
        callbackDetail(result);
    })
}

//Lấy thông tin thương hiệu sản phẩm theo mã
exports.detail = function(idBrand){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM thuonghieu WHERE math = ?";
        db.query(sql, idBrand, function(err, result){
            if(err){
                reject(err);
            }
            resolve(result);
        });
    })
}

//Cập nhật thông tin thương hiệu sản phẩm
exports.update = function(brand, idBrand){
    var sql = 'UPDATE thuonghieu SET ? WHERE math = ?';
    db.query(sql, [brand, idBrand], function (err, result){
        if(err)  {
            return console.error('err cap nhat: ' + err.message);
        }
    });
}

//Xóa thương hiệu sản phẩm vào thùng rác
exports.delete = function (date, idBrand){
    var sql = 'UPDATE thuonghieu SET deletedAt = ? WHERE math = ?';
    db.query(sql, [date, idBrand], function (err, result){
        if(err) {
            return console.error('err delete loai: ' + err.message);
        }
    })
}

//Kiểm tra khóa có tồn tại một sản phẩm nào không (kiểm tra trước khi xóa)
exports.findFK = function(idBrand, callbackFK){
    var sql = "SELECT masp FROM sanpham WHERE math = ? LIMIT 1";
    db.query(sql, idBrand, function(err, result){
        if(err){
            return console.error('err FK xoa: ' + err.message);
        }
        callbackFK(result);
    })
}

//Khôi phục thương hiệu ra khỏi thùng rác
exports.restore = function (date, idBrand){
    var sql = 'UPDATE thuonghieu SET deletedAt = ? WHERE math = ?';
    db.query(sql, [date, idBrand], function (err, result){
        if(err)  {
            return console.error('err khoi phuc: ' + err.message);
        }
    })
}

//Xóa vĩnh viễn
exports.forceDelete = function (idBrand){
    var sql = 'DELETE FROM thuonghieu WHERE math = ?';
    db.query(sql, idBrand, function (err, result){
        if(err)  {
            return console.error('err xoa vinh vien: ' + err.message);
        }
    })
}