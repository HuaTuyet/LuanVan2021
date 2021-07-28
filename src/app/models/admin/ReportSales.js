const db = require('../Database');

//Lấy danh sách sản phẩm đã bán trong khoảng thời gian ta chọn
exports.list = function(month, year){
    return new Promise((resolve, reject)=>{
        let sql = 'SELECT ct.masp, sp.tensp, SUM(ct.soluong) as soluongbanra, SUM(ct.soluong * ct.dongia) as doanhthutungsp, YEAR(dh.ngaydat), MONTH(dh.ngaydat) FROM chitietdonhang ct JOIN donhang dh ON ct.madh = dh.madh JOIN sanpham sp ON ct.masp = sp.masp WHERE MONTH(dh.ngaydat) = ? AND YEAR(dh.ngaydat) = ? AND dh.trangthai = 3 group by sp.tensp, year(dh.ngaydat), month(dh.ngaydat) ORDER BY ct.masp, sp.tensp, year(dh.ngaydat), month(dh.ngaydat)';
        db.query(sql, [month, year], function (err, result){
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
    
}

//Tính tổng doanh thu trong khoảng thời gian ta chọn
exports.total = function(month, year){
    return new Promise((resolve, reject)=>{
        let sql = 'SELECT SUM(ct.soluong * dongia) AS tong FROM chitietdonhang ct JOIN donhang dh ON ct.madh = dh.madh WHERE MONTH(dh.ngaydat) = ? AND YEAR(dh.ngaydat) = ? AND dh.trangthai = 3';
        db.query(sql, [month, year], function (err, result){
            if(err){
                reject(err);
            }
            resolve(result);
        })
    })
}