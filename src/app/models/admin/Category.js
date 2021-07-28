const db = require('../Database');

//Lấy danh sách loại sản phẩm chưa bị xóa vào thùng rác
// exports.list = function(callbackList){
//     const sql = "SELECT * FROM category WHERE deletedAt IS NULL";
//     db.query(sql, function(err,result){
//         if(err){
//             return console.error('err: ' + err.message);
//         }
//         callbackList(result);
//     })
// }

exports.list = function(){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM  loai WHERE deletedAt IS NULL";
        db.query(sql, function(err,result){
            if(err){
                reject(err);
            }
            resolve(result);
        });
    })
}

//Lấy danh sách loại sản phẩm đã bị xóa vào thùng rác
// exports.listTrash = function(callbackCount){
//     const sql = "SELECT * FROM category WHERE deletedAt IS NOT NULL";
//     db.query(sql, function(err,result){
//         if(err){
//             return console.error('err: ' + err.message);
//         }
//         callbackCount(result);
//     })
// }
exports.listTrash = function(){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM loai WHERE deletedAt IS NOT NULL";
        db.query(sql, function(err,result){
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
}

//Thêm loại sản phẩm
exports.create = function(category){
    let sql = "INSERT INTO loai SET ?";
    db.query(sql, category, function(err, result){
        if(err) {
            return console.error('err: ' + err.message);
        }
    });
}

//Kiểm tra khóa bên req có tồn tại trong cơ sở dữ liệu chưa (kiểm tra trước khi thêm)
exports.findId = function(idCat, callbackDetail){
    let sql = "SELECT maloai FROM loai WHERE maloai = ?";
    db.query(sql, idCat, function(err, result){
        if(err){
            return console.error('err: ' + err.message);
        }
        callbackDetail(result);
    })
}

//Lấy thông tin loại sản phẩm theo mã
// exports.detail = function(idCat, callbackDetail){
//     let sql = "SELECT * FROM category WHERE cat_id = ?";
//     db.query(sql, idCat, function(err, result){
//         if(err){
//             return console.error('err: ' + err.message);
//         }
//         callbackDetail(result);
//     })
// }

exports.detail = function(idCat){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM loai WHERE maloai = ?";
        db.query(sql, idCat, function(err, result){
            if(err){
                reject(err);
            }
            resolve(result);
        });
    })
}

//Cập nhật thông tin loại sản phẩm
exports.update = function(category, idCat){
    let sql = 'UPDATE loai SET ? WHERE maloai = ?';
    db.query(sql, [category, idCat], function (err, result){
        if(err)  {
            return console.error('err: ' + err.message);
        }
    });
}

//Xóa loại sản phẩm vào thùng rác
exports.delete = function (date, idCat){
    let sql = 'UPDATE loai SET deletedAt = ? WHERE maloai = ?';
    db.query(sql, [date, idCat], function (err, result){
        if(err) {
            return console.error('err delete loai: ' + err.message);
        }
    })
}

//Xóa vĩnh viễn
exports.forceDelete = function (idCat){
    let sql = 'DELETE FROM loai WHERE maloai = ?';
    db.query(sql, idCat, function (err, result){
        if(err)  {
            return console.error('err: ' + err.message);
        }
    })
}

//Khôi phục loại ra khỏi thùng rác
exports.restore = function (date, idCat){
    let sql = 'UPDATE loai SET deletedAt = ? WHERE maloai = ?';
    db.query(sql, [date, idCat], function (err, result){
        if(err)  {
            return console.error('err: ' + err.message);
        }
    })
}

//Đếm có bao loại sản phẩm bị xóa
// exports.countDeleted = function(callbackCounters){
//     let sql = 'SELECT COUNT(deletedAt) AS deletedCount FROM category';
//     db.query(sql, function(err,result){
//         if(err)  {
//             return console.error('err: ' + err.message);
//         }
//         callbackCounters(result);
//     })
// }

exports.countDeleted = function(){
    return new Promise((resolve, reject) =>{
        let sql = 'SELECT COUNT(deletedAt) AS deletedCount FROM loai';
        db.query(sql, function(err,result){
            if(err)  {
                reject(err);
            }
            resolve(result);
        });
    })
}

//Kiểm tra khóa có tồn tại một sản phẩm nào không (kiểm tra trước khi xóa)
exports.findFK = function(idCat, callbackFK){
    let sql = "SELECT masp FROM sanpham WHERE maloai = ? LIMIT 1";
    db.query(sql, idCat, function(err, result){
        if(err){
            return console.error('err: ' + err.message);
        }
        callbackFK(result);
    })
}