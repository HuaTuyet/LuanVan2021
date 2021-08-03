const db = require('../Database');

//Lấy danh sách phiếu nhập
exports.list = function(){
    return new Promise((resolve, reject)=>{
        let sql = 'SELECT pn.*, ncc.tenncc FROM phieunhap pn JOIN nhacungcap ncc ON pn.mancc = ncc.mancc ORDER BY pn.ngaynhap DESC';
        db.query(sql, function (err, result){
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
}

//Lấy thông tin chi tiết phiếu nhập
exports.detail = function(idSlip){
    return new Promise((resolve, reject) => {
        let sql = 'SELECT pn.*, ncc.tenncc FROM phieunhap pn JOIN nhacungcap ncc ON pn.mancc = ncc.mancc WHERE mapn = ?';
        db.query(sql, idSlip, function (err, result){
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
}

//Lấy thông tin sản phẩm hiển thị thông tin chi tiết phiếu nhập
exports.productDetailSlip = function(idSlip){
    return new Promise((resolve, reject) => {
        let sql = 'SELECT ctpn.masp, ctpn.soluong, ctpn.dongia as giagoc, sp.tensp FROM chitietphieunhap ctpn JOIN sanpham sp ON ctpn.masp = sp.masp WHERE ctpn.mapn = ?';
        db.query(sql, idSlip, function(err, result) {
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
}

//Lấy danh sách sản phẩm
exports.listProduct = function(){
    return new Promise((resolve, reject) => {
        let sql = 'SELECT sp.masp, sp.tensp FROM sanpham sp';
        db.query(sql, function(err, result){
            if (err){
                reject(err);
            }
            resolve(result);
        })
    })
}

//Lấy danh nhà cung cấp
exports.listVendor = function(){
    return new Promise((resolve, reject) => {
        let sql = 'SELECT ncc.mancc, ncc.tenncc FROM nhacungcap ncc WHERE deletedAt IS NULL';
        db.query(sql, function(err, result){
            if (err){
                reject(err);
            }
            resolve(result);
        })
    })
}

//Lấy thông tin sản phẩm
exports.product = function(idProduct, callback){
    let sql = "SELECT sp.masp, sp.tensp, sp.giagoc FROM sanpham sp WHERE masp = ?";
    db.query(sql, idProduct, function(err, result){
        if(err){
            return console.error('err: ' + err.message);
        }
        callback(result);
    })
}

//Thêm phiếu nhập
exports.create = function(slip){
    let sql = "INSERT INTO phieunhap SET ? ";
    db.query(sql, slip, function(err, result){
        if(err) {
            return console.error('err them PN: ' + err.message);
        }
    })
}

//Thêm chi tiết phiếu nhập
exports.createDetailSlip = function(deltailSlip){
    let sql = "INSERT INTO chitietphieunhap SET ? ";
    db.query(sql, deltailSlip, function(err, result){
        if(err) {
            return console.error('err them chi tiet PN: ' + err.message);
        }
    })
}

//Tăng số lượng sản phẩm sau khi thêm phiếu nhập
exports.increaseProductQuantity = function(quantity, idProduct){
    let sql = 'UPDATE sanpham SET soluong = soluong + ? WHERE masp = ?'
    db.query(sql, [quantity, idProduct], function(err, result){
        if(err)  {
            return console.error('err tang so luong san pham: ' + err.message);
        }
    })
}

//Lấy phiếu nhập theo mã
exports.getPN = function(idSlip, callback){
    let sql ='SELECT pn.mapn, pn.tongtien, pn.mancc, ct.masp, ct.soluong, ct.dongia as giagoc, sp.tensp FROM chitietphieunhap ct JOIN phieunhap pn ON ct.mapn = pn.mapn JOIN sanpham sp ON ct.masp = sp.masp WHERE ct.mapn = ?';
    db.query(sql, idSlip, function(err, result){
        if(err){
            return console.error('err lay phieu nhap: ' + err.message);
        }
        callback(result);
    })
}

//Cập nhật thông tin phiếu nhập theo mã
exports.updateSlip = function(totalSlip, idVendor, idSlip){
    let sql = 'UPDATE phieunhap SET tongtien = ?, mancc = ? WHERE mapn = ?'
    db.query(sql, [totalSlip, idVendor, idSlip], function (err, result){
        if(err)  {
            return console.error('err cap nhat PN: ' + err.message);
        }
    });
}

//Lấy số lượng sản phẩm trong chi tiết phiếu nhập
exports.getQuantityDetailSlip = function(idSlip, callback){
    let sql ='SELECT masp, soluong FROM chitietphieunhap WHERE mapn = ?'
    db.query(sql, idSlip, function(err, result){
        if(err){
            return console.error('err lay so luong sp trong CTPN: ' + err.message);
        }
        callback(result);
    })
}

//Xóa thông tin chi tiết phiếu nhập cũ
exports.deleteDetailSlip = function(idSlip){
    let sql = 'DELETE FROM chitietphieunhap WHERE mapn = ?';
    db.query(sql, idSlip, function (err, result){
        if(err)  {
            return console.error('err xoa chi tiet PN: ' + err.message);
        }
    })
}

//Cập nhật số lượng sau ta xóa thông tin chi tiết phiếu nhập cũ
exports.reduceProductQuantity = function(quantity, idProduct){
    let sql = 'UPDATE sanpham SET soluong = soluong - ? WHERE masp = ?'
    db.query(sql, [quantity, idProduct], function(err, result){
        if(err)  {
            return console.error('err giảm so luong san pham: ' + err.message);
        }
    })
}