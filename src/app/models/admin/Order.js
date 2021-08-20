const db = require('../Database');

//Lấy danh sách đơn hàng 
exports.list = function(){
    return new Promise((resolve, reject) => {
        let sql = "SELECT madh, tenkh, ngaydat, trangthai FROM donhang ORDER BY ngaydat DESC";
        db.query(sql, function(err,result){
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
}

//Lấy danh sách đơn hàng bằng ngày hiện tại
exports.sortToday = function(){
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM donhang WHERE DATE(ngaydat) = CURDATE() ORDER BY ngaydat DESC";
        db.query(sql, function(err,result){
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
}

//Lấy danh sách đơn hàng bằng ngày hôm qua
exports.sortYesterday = function(){
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM donhang WHERE DATE(ngaydat) = CURDATE() - 1 ORDER BY ngaydat DESC";
        db.query(sql, function(err,result){
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
}

//Lấy danh sách đơn hàng tuần trước
exports.sortLastWeek = function(){
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM donhang WHERE YEARWEEK(ngaydat) = YEARWEEK(NOW() - INTERVAL 1 WEEK) ORDER BY ngaydat DESC";
        db.query(sql, function(err,result){
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
}

//Lấy danh sách đơn hàng tháng trước
exports.sortLastMonth = function(){
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM donhang WHERE MONTH(ngaydat) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH) ORDER BY ngaydat DESC";
        db.query(sql, function(err,result){
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
}

//Kiểm tra xem mã dh này có tồn tại trong CSDL hay không 
exports.findId = function(idOrder, callbackDetail){
    var sql = "SELECT madh FROM donhang WHERE madh = ?";
    db.query(sql, idOrder, function(err, result){
        if(err){
            return console.error('err find khoa ngoai: ' + err.message);
        }
        callbackDetail(result);
    })
}

//Lấy thông tin chi tiết đơn hàng theo mã
exports.detail = function(idOrder){
    return new Promise((resolve, reject) => {
        let sql = "SELECT dh.*, vc.tenvc, tk.tentk FROM donhang dh INNER JOIN vanchuyen vc ON dh.mavc = vc.mavc INNER JOIN taikhoan tk ON dh.tentk = tk.tentk WHERE dh.madh = ?";
        db.query(sql, idOrder, function(err,result){
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
}

//Lấy thông tin sản phẩm của đơn hàng
exports.product = function(idOrder){
    return new Promise((resolve, reject) => {
        let sql = "SELECT ct.masp, ct.soluong, sp.tensp, ct.dongia AS giasp FROM donhang dh INNER JOIN chitietdonhang ct ON dh.madh = ct.madh INNER JOIN sanpham sp ON ct.masp = sp.masp WHERE dh.madh = ?";
        db.query(sql, idOrder, function(err,result) {
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
}

//Đổi trạng thái của đơn hàng
exports.changeStatus = function(status, idOrder){
    let sql ="UPDATE donhang SET trangthai = ? WHERE madh = ?";
    db.query(sql, [status, idOrder], function(err,result){
        if(err)  {
            return console.error('err thay doi trang thai don hang: ' + err.message);
        }
    })
}

//Cập nhật số lượng sản phẩm sau khi hủy đơn hàng
exports.increaseProductQuantity = function(quantity, idProduct){
    let sql = 'UPDATE sanpham SET soluong = soluong + ? WHERE masp = ?'
    db.query(sql, [quantity, idProduct], function(err, result){
        if(err)  {
            return console.error('err tang so luong san pham: ' + err.message);
        }
    })
}

//Lấy thông tin đơn hàng cho việc in hóa đơn
exports.getOrder = function(idOrder){
    return new Promise((resolve, reject) => {
        let sql = "SELECT dh.madh, DATE_FORMAT(dh.ngaydat, '%d-%m-%Y') as ngaydat, dh.tenkh, dh.diachi, dh.giamgia, dh.phivc, tk.email FROM donhang dh JOIN taikhoan tk ON dh.tentk = tk.tentk WHERE madh = ?";
        db.query(sql, idOrder, function(err,result) {
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
}

//Lấy thông tin chi tiết đơn hàng cho việc in hóa đơn
exports.getDetailOrder = function(idOrder){
    return new Promise((resolve, reject) => {
        let sql = "SELECT ct.soluong, sp.tensp, ct.dongia FROM chitietdonhang ct JOIN sanpham sp ON ct.masp = sp.masp WHERE ct.madh = ?";
        db.query(sql, idOrder, function(err,result) {
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
}