const db = require('../Database')

exports.createOrder = function(dh){
    // let sql = `INSERT INTO donhang(madh,ngaydat,tenkh,sodt,diachi,ghichu,giamgia,tongtien,trangthai,hinhthuctt,mavc,matk) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
    let sql = 'INSERT INTO donhang SET ?'
    db.query(sql, dh, function(err, data){
        if(err) throw err;
        console.log('Order Id:' + data.insertId);
    })
}

exports.createOrderDetail = function(arr, callback){
    let sql = `INSERT INTO chitietdonhang(madh,masp,soluong,dongia) VALUES ?`
    db.query(sql, [arr], function(err, data){
        if(err) throw err;
        callback(data.affectedRows);
        console.log('row insertId:' + data.affectedRows);
    })
}

exports.getOrder = function(tentk){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM donhang WHERE tentk = ? ORDER BY ngaydat DESC"; 
        db.query(sql, tentk, function(err, data){
            if(err){
                reject("Lấy dữ liệu thất bại: ",err);
            }
            resolve(data);
        })
    })
}
exports.getOneOrder = function(madh){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM donhang WHERE madh = ?"; 
        db.query(sql, madh, function(err, data){
            if(err){
                reject("Lấy dữ liệu thất bại: ",err);
            }
            resolve(data[0]);
        })
    })
}
exports.getOrderDetail = function(madh){
    return new Promise((resolve, reject) =>{
        //let sql = "SELECT chitietdonhang.*,sanpham.tensp FROM chitietdonhang JOIN sanpham ON chitietdonhang.masp = sanpham.masp WHERE madh = ?"; 
        let sql = "SELECT ct.*,sp.tensp, ha.tenhinh FROM chitietdonhang ct "+
        "INNER JOIN sanpham sp ON ct.masp = sp.masp INNER JOIN hinhanh ha ON sp.masp = ha.masp "+
        "INNER JOIN (SELECT masp, tenhinh FROM hinhanh GROUP BY masp) b ON ha.masp = b.masp AND ha.tenhinh = b.tenhinh WHERE madh = ?"
        db.query(sql, madh, function(err, data){
            if(err){
                reject("Lấy dữ liệu thất bại: ",err);
            }
            resolve(data);
        })
    })
}
exports.fnGetOrderDetail = function(madh, callback){
    let sql = "SELECT * FROM chitietdonhang WHERE madh = ?"; 
    db.query(sql, madh, function(err, data){
        if(err) throw err;
        callback(data);
    })
}

exports.destroyOrder = function(madh){
    return new Promise((resolve, reject) =>{
        let sql = "UPDATE donhang SET trangthai ='4' WHERE madh = ?";
        db.query(sql, madh, function(err, data){
            if(err){
                reject("Lấy dữ liệu thất bại: ",err);
            }
            resolve(data.affectedRows);
        })
    })
}

//=======================CẬP NHẬT SỐ LƯỢNG SP KHI ĐẶT HÀNG THÀNH CÔNG===========================
exports.updateQuantiy = function([qty, masp], operator){
    if(operator == "add"){
        let sql = 'UPDATE sanpham SET soluong = soluong + ? WHERE masp = ?'
        db.query(sql, [qty, masp], function(err, data){
            if(err) throw err;
        })
    } 
    else if(operator == "subtrac"){
        let sql = 'UPDATE sanpham SET soluong = soluong - ? WHERE masp = ?'
        db.query(sql, [qty, masp], function(err, data){
            if(err) throw err;
        })
    }
}

//=======================LẤY MÃ GIẢM GIÁ===========================
exports.getDiscount = function(magg){
    return new Promise((resolve, reject) =>{
        let sql = 'SELECT * FROM magiamgia WHERE magg = ?';
        db.query(sql, magg, function(err, data){
            if(err){
                reject("Lấy dữ liệu thất bại: ", err);
            }
            resolve(data[0]);
        })
    })
}
