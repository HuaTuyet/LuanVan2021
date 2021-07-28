const db = require('../Database');

//Lấy danh sách sản phẩm chưa bị xóa vào thùng rác
exports.list = function(){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT masp, tensp, giaban, soluong FROM  sanpham WHERE deletedAt IS NULL";
        db.query(sql, function(err,result){
            if(err){
                reject(err);
            }
            resolve(result);
        });
    })
}

//Đếm số sản phẩm đã bị xóa
exports.countDeleted = function(){
    return new Promise((resolve, reject) =>{
        let sql = 'SELECT COUNT(deletedAt) AS deletedCount FROM sanpham';
        db.query(sql, function(err,result){
            if(err)  {
                reject(err);
            }
            resolve(result);
        });
    })
}

//Lấy danh sách sản phẩm đã bị xóa vào thùng rác
exports.listTrash = function(){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM sanpham WHERE deletedAt IS NOT NULL";
        db.query(sql, function(err,result){
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
}

//Lấy thông tin chi tiết sản phẩm theo mã
exports.detail = function(idProduct){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT sp.*, l.tenloai, th.tenth FROM sanpham sp JOIN loai l ON sp.maloai = l.maloai JOIN thuonghieu th ON th.math = sp.math WHERE sp.masp = ?";
        db.query(sql, idProduct, function(err, result){
            if(err){
                reject(err);
            }
            resolve(result);
        });
    })
}

//Lấy màu của sản phẩm theo mã sản phẩm
exports.color = function (idProduct){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT  ms.* FROM sanpham sp INNER JOIN chitietmausac ctms ON sp.masp = ctms.masp INNER JOIN mausac ms on ctms.mamau = ms.mamau WHERE sp.masp = ?";
        db.query(sql, idProduct, function(err,result){
            if(err){
                reject(err);
            }
            resolve(result);
        });
    })
}

//Lấy thông số của sản phẩm theo mã sản phẩm
exports.specification = function (idProduct){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT  ts.tents, ctts.mats ,ctts.giatrits FROM sanpham sp INNER JOIN chitietthongso ctts ON sp.masp = ctts.masp INNER JOIN thongso ts on ctts.mats = ts.mats WHERE sp.masp = ?";
        db.query(sql, idProduct, function(err, result){
            if(err){
                reject(err);
            }
            resolve(result);
        });
    })
}

//Lấy danh sách hình ảnh của sản phẩm theo mã sản phẩm
exports.images = function(idProduct){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM hinhanh WHERE masp = ?";
        db.query(sql, idProduct, function(err, result){
            if(err){
                reject(err);
            }
            resolve(result);
        });
    })
}

//Lấy danh sách loại sản phẩm
exports.listCategory = function(){
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

//Lấy danh sách thương hiệu sản phẩm
exports.listBrand = function(){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM thuonghieu WHERE deletedAt IS NULL";
        db.query(sql, function(err,result){
            if(err){
                reject(err);
            }
            resolve(result);
        });
    })
}

//Lấy danh sách mã giảm giá sản phẩm
exports.listCoupon = function(){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM magiamgia WHERE deletedAt IS NULL";
        db.query(sql, function(err,result){
            if(err){
                reject(err);
            }
            resolve(result);
        });
    })
}

//Lấy danh sách màu sắc sản phẩm
exports.listColor = function(){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM mausac";
        db.query(sql, function(err,result){
            if(err){
                reject(err);
            }
            resolve(result);
        });
    })
}

//Lấy danh sách thông số sản phẩm
exports.listSpecification = function(){
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM thongso";
        db.query(sql, function(err,result){
            if(err){
                reject(err);
            }
            resolve(result);
        });
    })
}


//Thêm sản phẩm
exports.create = function(product){
    let sql = "INSERT INTO sanpham SET ? ";
    db.query(sql, [product], function(err, result){
        if(err) {
            return console.error('err them SP: ' + err.message);
        }
    });
}

//kiểm tra mã sản phẩm đã tồn tại hay chưa
exports.findId = function(idProduct, callbackDetail){
    var sql = "SELECT masp FROM sanpham WHERE masp = ?";
    db.query(sql, idProduct, function(err, result){
        if(err){
            return console.error('err: ' + err.message);
        }
        callbackDetail(result);
    })
}

//Thêm chi tiết màu sắc sản phẩm
exports.createColor = function(idProduct, idColor){
    let sql = "INSERT INTO chitietmausac SET masp = ? , mamau = ?";
    db.query(sql, [idProduct, idColor], function(err, result){
        if(err) {
            return console.error('err them CTMS: ' + err.message);
        }
    });
}

//Thêm chi tiết thông số sản phẩm
exports.createSpec = function(idSpec, idProduct, valueSpec){
    let sql = "INSERT INTO chitietthongso SET mats = ?, masp = ? , giatrits = ?";
    db.query(sql, [idSpec, idProduct, valueSpec], function(err, result){
        if(err) {
            return console.error('err them CTTS: ' + err.message);
        }
    });
}

//Thêm hình vào sản phẩm
exports.createHA = function(mahinh, masp){
    let sql = 'INSERT INTO hinhanh SET tenhinh= ?, masp = ?';
    db.query(sql, [mahinh, masp], function (err, result){
        if(err)  {
            return console.error('err them hinh anh: ' + err.message);
        }
    });
}

//Sửa sản phẩm
exports.update = function(product, idProduct){
    let sql = 'UPDATE sanpham SET ? WHERE masp = ?';
    db.query(sql,[product, idProduct], function (err, result){
        if(err)  {
            return console.error('err sua san pham: ' + err.message);
        }
    })
}

//Sửa chi tiết thông số sản phẩm
exports.updateSpec = function(valueSpec, idProduct, idSpec){
    let sql = "UPDATE chitietthongso SET giatrits = ? WHERE masp = ? AND mats = ?";
    db.query(sql, [valueSpec, idProduct, idSpec], function(err, result){
        if(err) {
            return console.error('err cap nhat CTTS: ' + err.message);
        }
    });
}

//Kiểm tra đã tồn tại bao nhiêu mã hình ảnh
exports.findHA = function(idProduct, callbackHA){
    let sql = 'SELECT tenhinh FROM `hinhanh` WHERE masp = ?';
    db.query(sql, idProduct, function(err, result){
        if(err) {
            return console.error('err kiem tra hinh: ' + err.message);
        }
        callbackHA(result);
    })
}

//Xóa hình theo tên hình
exports.deleteHAtheoten = function(tenhinh){
    let sql = "DELETE FROM hinhanh WHERE tenhinh = ?";
    db.query(sql, tenhinh, function (err, result){
        if(err)  {
            return console.error('err xoa hinh anh theo ten: ' + err.message);
        }
    });
}



//Cập nhật tên hình ảnh
// exports.updateHA = function(tenhinhmoi, tenhinhcu){
//     let sql = 'UPDATE hinhanh SET tenhinh ? WHERE tenhinh LIKE %?%';
//     db.query(sql,[tenhinhmoi, tenhinhcu], function (err, result){
//         if(err)  {
//             return console.error('err sua ten hinh: ' + err.message);
//         }
//     })
// }

//Xóa sản phẩm vào thùng rác
exports.delete = function (date, idProduct){
    let sql = 'UPDATE sanpham SET deletedAt = ? WHERE masp = ?';
    db.query(sql, [date, idProduct], function (err, result){
        if(err) {
            return console.error('err delete san pham: ' + err.message);
        }
    })
}

//Kiểm tra trong chi tiết đơn hàng có tồn tại sản phẩm này khi xóa
exports.findFK = function(idProduct, callbackFK){
    let sql = "SELECT masp FROM chitietdonhang WHERE masp = ? LIMIT 1";
    db.query(sql, idProduct, function(err, result){
        if(err){
            return console.error('err: ' + err.message);
        }
        callbackFK(result);
    })
}

//Khôi phục sản phẩm ra khỏi thùng rác
exports.restore = function(date, idProduct){
    let sql = 'UPDATE sanpham SET deletedAt = ? WHERE masp = ?';
    db.query(sql, [date, idProduct], function (err, result){
        if(err) {
            return console.error('err restore san pham: ' + err.message);
        }
    })
}

//Xóa vĩnh viễn sản phẩm
exports.forceDelete = function(idProduct){
    let sql = 'DELETE FROM sanpham WHERE masp = ?';
    db.query(sql, idProduct, function(err, result){
        if(err) {
            return console.error('err forceDelete san pham: ' + err.message);
        }
    })
}

//Đếm số hình mà sản phẩm có
// exports.countImages = function(idProduct ,callbackCounters){
//     let sql = 'SELECT COUNT(*) AS count FROM hinhanh WHERE masp = ?';
//     db.query(sql, idProduct, function (err, result){
//         if(err)  {
//             return console.error('err dem hinh anh san pham: ' + err.message);
//         }
//         callbackCounters(result);
//     });
// }

// Lấy tên hình ảnh để thực hiện việc xóa file trong thư mục
exports.findtenHA = function(masp, callbackHA){
    let sql = "SELECT tenhinh FROM hinhanh WHERE masp = ?";
    db.query(sql, masp, function(err, result){
        if(err) {
            return console.error('err kiem tra hinh: ' + err.message);
        }
        callbackHA(result);
    })
}

//Xóa hình ảnh sản phẩm trong database
exports.deleteHA = function(idProduct){
    let sql = 'DELETE FROM hinhanh WHERE masp = ?';
    db.query(sql, idProduct, function(err,result){
        if(err){
            return console.error('err delete hinh anh san pham: ' + err.message);
        }
    })
}

//Xóa màu sắc sản phẩm
exports.deleteColor = function(idProduct){
    let sql = 'DELETE FROM chitietmausac WHERE masp = ?';
    db.query(sql, idProduct, function(err, result){
        if(err){
            return console.error('err delete mau sac san pham:' + err.message);
        }
    })
}

//Xóa thông số sản phẩm
exports.deleteSpec = function(idProduct){
    let sql = 'DELETE FROM chitietthongso WHERE masp = ?';
    db.query(sql, idProduct, function(err, result){
        if(err){
            return console.error('err delete thong so san pham:' + err.message);
        }
    })
}