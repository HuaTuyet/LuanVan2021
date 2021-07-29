const { ExpressHandlebars } = require('express-handlebars');
const db = require('../Database')

// exports.list = function(callbackQuery){
//     let sql = "SELECT * FROM sanpham";
//     db.query(sql, function(err, data, fields){
//         if(err){
//             return console.error('Error: ' + err.message);
//         }
//         callbackQuery(data);
//     });
// }

exports.getAProduct = function(masp, callbackQuery){
    let sql = "SELECT * FROM sanpham WHERE masp = ?";
    db.query(sql, masp, function(err, data, fields){
        if(err){
            return console.error('Error: ' + err.message);
        }
        callbackQuery(data[0]);
    });
}

// exports.getAProduct = function(masp){
//     return new Promise((resolve, reject) => {
//         let sql = "SELECT * FROM sanpham WHERE masp = ?";
//         db.query(sql, masp, function(err, data, fields){
//             if(err){
//                 reject(err);
//             }
//             resolve(data);
//         });
//     })
// }
exports.list = function(){
    return new Promise((resolve, reject) => {
        let sql = "SELECT sanpham.*, (SELECT hinhanh.tenhinh FROM sanpham JOIN hinhanh ON sanpham.masp = hinhanh.masp LIMIT 1) AS tenhinh FROM sanpham WHERE soluong > 0";
        db.query(sql, function(err, data, fields){
            if(err){
                reject(err);
            }
            resolve(data);
        });
    })
}

// ============================= HOME PAGE ==============================
exports.promotionList = function(){
    return new Promise((resolve, reject) => {
        let sql = "SELECT sp.*, ha.tenhinh FROM sanpham sp INNER JOIN hinhanh ha ON sp.masp = ha.masp WHERE giagiam > 0 AND soluong > 0";
        db.query(sql, function(err, data, fields){
            if(err){
                reject(err);
            }
            resolve(data);
        });
    })
}

exports.getImage = function(masp, callback){
    let sql = "SELECT * hinhanh WHERE masp = ?";
    db.query(sql,masp,function(err, data, fields){
        if(err){
            throw err;
        }
        callback(data[0].tenhinh);
    });
}

/// TESSTTTT GIT
exports.getImages = function(masp, callback){
    let sql = "SELECT * hinhanh WHERE masp = ?";
    db.query(sql,masp,function(err, data, fields){
        if(err){
            throw err;
        }
        callback(data[0].tenhinh);
    });
}

// ============================= DETAIL PAGE ==============================
exports.detail = function(masp){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM sanpham WHERE masp = ?";
        db.query(sql, masp, function(err, data, fields){
            if(err){
                reject(err);
            }
            resolve(data[0]);
        });
    })
}

exports.thongso = function(masp){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT chitietthongso.*, thongso.tents FROM chitietthongso JOIN thongso ON chitietthongso.mats = thongso.mats WHERE masp=?";
        db.query(sql, masp, function(err, data, fields){
            if(err){
                reject(err);
            }
            resolve(data);
        });
    })
}

exports.brandOfProduct = function(masp){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT thuonghieu.tenth FROM sanpham JOIN thuonghieu ON sanpham.math = thuonghieu.math WHERE masp = ?";
        db.query(sql, masp, function(err, data){
            if(err){
                reject(err);
            }
            resolve(data[0]);
        });
    })
}

exports.imgOfProduct = function(masp){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM hinhanh WHERE masp = ?";
        db.query(sql, masp, function(err, data){
            if(err){
                reject(err);
            }
            resolve(data);
        });
    })
}

exports.colorOfProduct = function(masp){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM chitietmausac WHERE masp = ?";
        db.query(sql, masp, function(err, data){
            if(err){
                reject(err);
            }
            resolve(data);
        });
    })
}

exports.getComment = function(masp){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT binhluan.*, taikhoan.anhdd, taikhoan.tentk FROM binhluan JOIN taikhoan ON binhluan.tentk = taikhoan.tentk WHERE masp = ?";
        db.query(sql, masp, function(err, data){
            if(err) reject(err);
            resolve(data);
        })
    })
}
exports.getRate = function(masp){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM danhgia WHERE masp = ?";
        db.query(sql, masp, function(err, data){
            if(err) reject(err);
            resolve(data);
        })
    })
}
exports.getRateFn = function(masp, result){
    let sql = "SELECT * FROM danhgia WHERE masp = ?";
    db.query(sql, masp, function(err, data){
        if(err) throw err;
        result(data);
    })
}

exports.postComment = function(cmt){
    let sql = "INSERT INTO binhluan SET ?";
    db.query(sql, cmt, function(err, data){
        if(err) throw err;
    })
}
exports.rating = function(rate, row){
    let sql = "INSERT INTO danhgia SET ?";
    db.query(sql, rate, function(err, data){
        if(err) throw err;
        row(data.affectedRows);
    })
}

// ============================= PRODUCTS PAGE ==============================
exports.getBrands = function(){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM thuonghieu";
        db.query(sql, function(err, data){
            if(err){
                reject("Kết nối CSDL thất bại: ",err);
            }
            resolve(data);
        })
    })
}

exports.getTypes = function(){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT * FROM loai";
        db.query(sql, function(err, data){
            if(err){
                reject("Kết nối CSDL thất bại: ",err);
            }
            resolve(data);
        })
    })
}

exports.getProducts = function([start, count]){
    return new Promise((resolve, reject) =>{
        // let sql = "SELECT sanpham.*, phieunhap.ngaynhap FROM sanpham " +
        // "JOIN chitietphieunhap ON sanpham.masp = chitietphieunhap.masp " +
        // "JOIN phieunhap ON chitietphieunhap.mapn = phieunhap.mapn ORDER BY ngaynhap DESC LIMIT ?, ?";
        let sql = "SELECT * FROM sanpham  LIMIT ?, ?";
        db.query(sql,[start, count], function(err, data){
            if(err){
                reject("Lấy dữ liệu thất bại: ",err);
            }
            resolve(data);
        })
    })
}

exports.getProductsByBrand = function([math, start, count]){
    return new Promise((resolve, reject) =>{
        // let sql = "SELECT sanpham.*, phieunhap.ngaynhap FROM sanpham " +
        // "JOIN chitietphieunhap ON sanpham.masp = chitietphieunhap.masp " +
        // "JOIN phieunhap ON chitietphieunhap.mapn = phieunhap.mapn WHERE sanpham.math = ? "+ 
        // "ORDER BY ngaynhap DESC LIMIT ?, ?";
        let sql = "SELECT * FROM sanpham WHERE math = ? LIMIT ?, ?";
        db.query(sql,[math, start, count], function(err, data){
            if(err){
                reject("Lấy dữ liệu thất bại: ",err);
            }
            resolve(data);
        })
    })
}

exports.getProductsByType = function([maloai, start, count]){
    return new Promise((resolve, reject) =>{
        // let sql = "SELECT sanpham.*, phieunhap.ngaynhap FROM sanpham " +
        // "JOIN chitietphieunhap ON sanpham.masp = chitietphieunhap.masp " +
        // "JOIN phieunhap ON chitietphieunhap.mapn = phieunhap.mapn WHERE sanpham.maloai = ? "+ 
        // "ORDER BY ngaynhap DESC LIMIT ?, ?";
        let sql = "SELECT * FROM sanpham WHERE maloai = ? LIMIT ?, ?";
        db.query(sql,[maloai, start, count], function(err, data){
            if(err){ 
                reject("Lấy dữ liệu thất bại: ",err);
            }
            console.log("dssp loai - model: ",data);
            resolve(data);
        })
    })
}

exports.countAllProduct = function(){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT count(*) AS total FROM sanpham"; 
        db.query(sql, function(err, data){
            if(err){
                reject("Lấy dữ liệu thất bại: ",err);
            }
            resolve(data[0].total);
        })
    })
}

exports.countAllByBrand = function(math){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT count(*) AS total FROM sanpham WHERE math = ?"; 
        db.query(sql, math, function(err, data){
            if(err){
                reject("Lấy dữ liệu thất bại: ",err);
            }
            resolve(data[0].total);
        })
    })
}

exports.countAllByType = function(maloai){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT count(*) AS total FROM sanpham WHERE maloai = ?"; 
        db.query(sql, maloai, function(err, data){
            if(err){
                reject("Lấy dữ liệu thất bại: ",err);
            }
            resolve(data[0].total);
        })
    })
}
// ================== Sort
exports.sortPriceDesc = function([start, count]){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT *, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham ORDER BY giasp DESC LIMIT ?, ?";
        db.query(sql,[start, count], function(err, data){
            if(err)
                reject(err);
            resolve(data);
        })
    })
}
exports.sortPriceAsc = function([start, count]){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT *, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham ORDER BY giasp ASC LIMIT ?, ?";
        db.query(sql,[start, count], function(err, data){
            if(err)
                reject(err);
            resolve(data); 
        })
    })
}

exports.sortPriceDescByBrand = function([math, start, count]){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT *, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham WHERE math=? ORDER BY giasp DESC LIMIT ?, ?";
        db.query(sql,[math, start, count], function(err, data){
            if(err)
                reject(err);
            resolve(data);
        })
    })
}
exports.sortPriceAscByBrand = function([math, start, count]){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT *, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham WHERE math=? ORDER BY giasp ASC LIMIT ?, ?";
        db.query(sql,[math, start, count], function(err, data){
            if(err)
                reject(err);
            resolve(data);
        })
    })
}

exports.sortPriceDescByType = function([maloai, start, count]){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT *, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham WHERE maloai=? ORDER BY giasp DESC LIMIT ?, ?";
        db.query(sql,[maloai, start, count], function(err, data){
            if(err)
                reject(err);
            resolve(data);
        })
    })
}
exports.sortPriceAscByType = function([maloai, start, count]){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT *, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham WHERE maloai=? ORDER BY giasp ASC LIMIT ?, ?";
        db.query(sql,[maloai, start, count], function(err, data){
            if(err)
                reject(err);
            resolve(data);
        })
    })
}

// ============================= CART PAGE ==============================
exports.getDelivery = function(result){
        let sql = "SELECT * FROM vanchuyen";
        db.query(sql,function(err, data){
            if(err) throw err;
            result(data);
        });
}

