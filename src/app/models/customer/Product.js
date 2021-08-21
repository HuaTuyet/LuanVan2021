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
    //let sql = "SELECT * FROM sanpham WHERE masp = ?";
    let sql = "SELECT sp.*, ha.tenhinh FROM sanpham sp INNER JOIN hinhanh ha "+
    "ON sp.masp = ha.masp INNER JOIN (SELECT masp, tenhinh FROM hinhanh GROUP BY masp) b "
    +"ON ha.masp = b.masp AND ha.tenhinh = b.tenhinh WHERE sp.masp = ? AND sp.deletedAt IS NULL"
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
        let sql = "SELECT sp.*, ha.tenhinh FROM sanpham sp INNER JOIN hinhanh ha ON sp.masp = ha.masp "+
        "INNER JOIN (SELECT masp, tenhinh FROM hinhanh GROUP BY masp) b ON ha.masp = b.masp "+
        "AND ha.tenhinh = b.tenhinh WHERE sp.deletedAt IS NULL";
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
        let sql = "SELECT sp.*, ha.tenhinh FROM sanpham sp INNER JOIN hinhanh ha ON sp.masp = ha.masp "+
        "INNER JOIN (SELECT masp, tenhinh FROM hinhanh GROUP BY masp) b ON ha.masp = b.masp "+
        "AND ha.tenhinh = b.tenhinh WHERE giagiam > 0 AND sp.deletedAt IS NULL";
        db.query(sql, function(err, data, fields){
            if(err){
                reject(err);
            }
            resolve(data);
        });
    })
}

// exports.getImage = function(masp, callback){
//     //let sql = "SELECT * hinhanh WHERE masp = ?";
//     let sql = "SELECT * hinhanh ha INNER JOIN sanpham sp ON sp.masp = ha.masp WHERE ha.masp = ? AND sp.deletedAt IS NULL";
//     db.query(sql,masp,function(err, data, fields){
//         if(err){
//             throw err;
//         }
//         callback(data[0].tenhinh);
//     });
// }

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
        let sql = "SELECT chitietthongso.*, thongso.tents FROM chitietthongso JOIN thongso ON chitietthongso.mats = thongso.mats WHERE chitietthongso.masp=?";
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
exports.checkBoughtProduct = function(tentk, masp, result){
    let sql = "SELECT ctdh.masp FROM chitietdonhang ctdh INNER JOIN donhang dh ON ctdh.madh = dh.madh WHERE dh.tentk = ? AND ctdh.masp = ?";
    db.query(sql, [tentk, masp], function(err, data){
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
        let sql = "SELECT * FROM thuonghieu WHERE deletedAt IS NULL";
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
        let sql = "SELECT * FROM loai WHERE deletedAt IS NULL";
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
        let sql = "SELECT sp.*, MAX(pn.ngaynhap) max_date, ha.tenhinh FROM sanpham sp " +
        "INNER JOIN chitietphieunhap ct ON sp.masp = ct.masp " +
        "INNER JOIN phieunhap pn ON ct.mapn = pn.mapn "+
        "INNER JOIN hinhanh ha ON sp.masp = ha.masp "+
        "INNER JOIN (SELECT masp, tenhinh FROM hinhanh GROUP BY masp) b ON ha.masp = b.masp "+
        "AND ha.tenhinh = b.tenhinh WHERE sp.deletedAt IS NULL GROUP BY ct.masp ORDER BY max_date DESC LIMIT ?, ?";
        //let sql = "SELECT * FROM sanpham  LIMIT ?, ?";
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
        let sql = "SELECT sp.*, MAX(pn.ngaynhap) max_date, ha.tenhinh FROM sanpham sp " +
        "INNER JOIN chitietphieunhap ct ON sp.masp = ct.masp " +
        "INNER JOIN phieunhap pn ON ct.mapn = pn.mapn "+
        "INNER JOIN hinhanh ha ON sp.masp = ha.masp "+
        "INNER JOIN (SELECT masp, tenhinh FROM hinhanh GROUP BY masp) b ON ha.masp = b.masp "+
        "AND ha.tenhinh = b.tenhinh WHERE sp.math = ? AND sp.deletedAt IS NULL GROUP BY ct.masp ORDER BY max_date DESC LIMIT ?, ?";
        //let sql = "SELECT * FROM sanpham WHERE math = ? LIMIT ?, ?";
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
        let sql = "SELECT sp.*, MAX(pn.ngaynhap) max_date, ha.tenhinh FROM sanpham sp " +
        "INNER JOIN chitietphieunhap ct ON sp.masp = ct.masp " +
        "INNER JOIN phieunhap pn ON ct.mapn = pn.mapn "+
        "INNER JOIN hinhanh ha ON sp.masp = ha.masp "+
        "INNER JOIN (SELECT masp, tenhinh FROM hinhanh GROUP BY masp) b ON ha.masp = b.masp "+
        "AND ha.tenhinh = b.tenhinh WHERE sp.maloai = ? AND sp.deletedAt IS NULL GROUP BY ct.masp ORDER BY max_date DESC LIMIT ?, ?";
        //let sql = "SELECT * FROM sanpham WHERE maloai = ? LIMIT ?, ?";
        db.query(sql,[maloai, start, count], function(err, data){
            if(err){ 
                reject("Lấy dữ liệu thất bại: ",err);
            }
            console.log("dssp loai - model: ",data);
            resolve(data);
        })
    })
}

exports.getProductsByPrice = function(gia, [start, count]){
    return new Promise((resolve, reject) =>{
        let sql = "";
        if(gia === "under"){
            sql = "SELECT * FROM sanpham sp "+
            "INNER JOIN (SELECT masp, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham) a "+
            "ON sp.masp = a.masp INNER JOIN hinhanh ha ON sp.masp = ha.masp "+
            "INNER JOIN (SELECT masp, tenhinh FROM hinhanh GROUP BY masp) b ON ha.masp = b.masp "+
            "AND ha.tenhinh = b.tenhinh WHERE a.giasp <= 10000000 AND sp.deletedAt IS NULL LIMIT ?, ?"; 
        } 
        else if(gia === "upper"){
            sql = "SELECT * FROM sanpham sp "+
            "INNER JOIN (SELECT masp, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham) a "+
            "ON sp.masp = a.masp INNER JOIN hinhanh ha ON sp.masp = ha.masp "+
            "INNER JOIN (SELECT masp, tenhinh FROM hinhanh GROUP BY masp) b ON ha.masp = b.masp "+
            "AND ha.tenhinh = b.tenhinh WHERE a.giasp >= 10000000 AND sp.deletedAt IS NULL LIMIT ?, ?"; 
        } 
        db.query(sql, [start, count], function(err, data){
            if(err){
                reject("Lấy dữ liệu thất bại: ",err);
            }
            resolve(data);
        })
    })
}

// exports.getProductsByPriceOption = function([from, to, start, count]){
//     return new Promise((resolve, reject) =>{
//         let sql = "SELECT * FROM sanpham sp "+
//             "INNER JOIN (SELECT masp, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham) a "+
//             "ON sp.masp = a.masp INNER JOIN hinhanh ha ON sp.masp = ha.masp "+
//             "INNER JOIN (SELECT masp, tenhinh FROM hinhanh GROUP BY masp) b ON ha.masp = b.masp "+
//             "AND ha.tenhinh = b.tenhinh WHERE a.giasp >= ? AND a.giasp <= ? LIMIT ?, ?"; 
//         db.query(sql, [from, to, start, count], function(err, data){
//             if(err){
//                 reject("Lấy dữ liệu thất bại: ",err);
//             }
//             resolve(data);
//         })
//     })
// }

exports.countAllProduct = function(){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT count(*) AS total FROM sanpham WHERE deletedAt IS NULL"; 
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
        let sql = "SELECT count(*) AS total FROM sanpham WHERE math = ? AND deletedAt IS NULL"; 
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
        let sql = "SELECT count(*) AS total FROM sanpham WHERE maloai = ? AND deletedAt IS NULL"; 
        db.query(sql, maloai, function(err, data){
            if(err){
                reject("Lấy dữ liệu thất bại: ",err);
            }
            resolve(data[0].total);
        })
    })
}

exports.countAllByPrice = function(gia){
    return new Promise((resolve, reject) =>{
        let sql = "";
        if(gia === "under"){
            sql = "SELECT COUNT(*) AS total FROM sanpham sp "+
            "INNER JOIN (SELECT masp, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham) a "+
            "ON sp.masp = a.masp WHERE a.giasp <= 10000000 AND sp.deletedAt IS NULL"; 
        } 
        else if(gia === "upper"){
            sql = "SELECT COUNT(*) AS total FROM sanpham sp "+
            "INNER JOIN (SELECT masp, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham) a "+
            "ON sp.masp = a.masp WHERE a.giasp >= 10000000 AND sp.deletedAt IS NULL"; 
        }
        db.query(sql, function(err, data){
            if(err){
                reject("Lấy dữ liệu thất bại: ",err);
            }
            resolve(data[0].total);
        })
    })
}
// exports.countAllByPriceOption = function([from, to]){
//     return new Promise((resolve, reject) =>{
//         let sql = "SELECT COUNT(*) AS total FROM sanpham sp "+
//             "INNER JOIN (SELECT masp, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham) a "+
//             "ON sp.masp = a.masp WHERE a.giasp >= ? AND a.giasp <= ?"; 
//         db.query(sql, [from, to], function(err, data){
//             if(err){
//                 reject("Lấy dữ liệu thất bại: ",err);
//             }
//             resolve(data[0].total);
//         })
//     })
//}
// ================== Sort
exports.sortPriceDesc = function([start, count]){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT *, IF(giagiam > 0, giagiam, giaban) AS giasp, ha.tenhinh FROM sanpham sp "+
        "INNER JOIN hinhanh ha ON sp.masp = ha.masp INNER JOIN "+
        "(SELECT masp, tenhinh FROM hinhanh GROUP BY masp) b ON ha.masp = b.masp AND ha.tenhinh = b.tenhinh "+
        "WHERE sp.deletedAt IS NULL ORDER BY giasp DESC LIMIT ?, ?";
        db.query(sql,[start, count], function(err, data){
            if(err)
                reject(err);
            resolve(data);
        })
    })
}
exports.sortPriceAsc = function([start, count]){
    return new Promise((resolve, reject) =>{
        //let sql = "SELECT *, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham ORDER BY giasp ASC LIMIT ?, ?";
        let sql = "SELECT *, IF(giagiam > 0, giagiam, giaban) AS giasp, ha.tenhinh FROM sanpham sp "+
        "INNER JOIN hinhanh ha ON sp.masp = ha.masp INNER JOIN "+
        "(SELECT masp, tenhinh FROM hinhanh GROUP BY masp) b ON ha.masp = b.masp AND ha.tenhinh = b.tenhinh "+
        "WHERE sp.deletedAt IS NULL ORDER BY giasp ASC LIMIT ?, ?"; 
        db.query(sql,[start, count], function(err, data){
            if(err)
                reject(err);
            resolve(data); 
        })
    })
}

exports.sortPriceDescByBrand = function([math, start, count]){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT *, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham WHERE math=? AND sanpham.deletedAt IS NULL ORDER BY giasp DESC LIMIT ?, ?";
        db.query(sql,[math, start, count], function(err, data){
            if(err)
                reject(err);
            resolve(data);
        })
    })
}
exports.sortPriceAscByBrand = function([math, start, count]){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT *, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham WHERE math=? AND sanpham.deletedAt IS NULL ORDER BY giasp ASC LIMIT ?, ?";
        db.query(sql,[math, start, count], function(err, data){
            if(err)
                reject(err);
            resolve(data);
        })
    })
}

exports.sortPriceDescByType = function([maloai, start, count]){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT *, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham WHERE maloai=? AND sanpham.deletedAt IS NULL ORDER BY giasp DESC LIMIT ?, ?";
        db.query(sql,[maloai, start, count], function(err, data){
            if(err)
                reject(err);
            resolve(data);
        })
    })
}
exports.sortPriceAscByType = function([maloai, start, count]){
    return new Promise((resolve, reject) =>{
        let sql = "SELECT *, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham WHERE maloai=? AND sanpham.deletedAt IS NULL ORDER BY giasp ASC LIMIT ?, ?";
        db.query(sql,[maloai, start, count], function(err, data){
            if(err)
                reject(err);
            resolve(data);
        })
    })
}
exports.sortPriceAscByPrice = function(gia, [start, count]){
    return new Promise((resolve, reject) =>{
        //let sql = "SELECT *, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham WHERE maloai=? ORDER BY giasp ASC LIMIT ?, ?";
        let sql = "";
        if(gia === "under"){
            sql = "SELECT * FROM sanpham sp "+
            "INNER JOIN (SELECT masp, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham) a "+
            "ON sp.masp = a.masp INNER JOIN hinhanh ha ON sp.masp = ha.masp "+
            "INNER JOIN (SELECT masp, tenhinh FROM hinhanh GROUP BY masp) b ON ha.masp = b.masp "+
            "AND ha.tenhinh = b.tenhinh WHERE a.giasp <= 10000000 AND sp.deletedAt IS NULL ORDER BY a.giasp ASC LIMIT ?, ?"; 
        } 
        else if(gia === "upper"){
            sql = "SELECT * FROM sanpham sp "+
            "INNER JOIN (SELECT masp, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham) a "+
            "ON sp.masp = a.masp INNER JOIN hinhanh ha ON sp.masp = ha.masp "+
            "INNER JOIN (SELECT masp, tenhinh FROM hinhanh GROUP BY masp) b ON ha.masp = b.masp "+
            "AND ha.tenhinh = b.tenhinh WHERE a.giasp >= 10000000 AND sp.deletedAt IS NULL ORDER BY a.giasp ASC LIMIT ?, ?"; 
        } 
        db.query(sql,[start, count], function(err, data){
            if(err)
                reject(err);
            resolve(data);
        })
    })
}
exports.sortPriceDescByPrice = function(gia, [start, count]){
    return new Promise((resolve, reject) =>{
        //let sql = "SELECT *, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham WHERE maloai=? ORDER BY giasp ASC LIMIT ?, ?";
        let sql = "";
        if(gia === "under"){
            sql = "SELECT * FROM sanpham sp "+
            "INNER JOIN (SELECT masp, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham) a "+
            "ON sp.masp = a.masp INNER JOIN hinhanh ha ON sp.masp = ha.masp "+
            "INNER JOIN (SELECT masp, tenhinh FROM hinhanh GROUP BY masp) b ON ha.masp = b.masp "+
            "AND ha.tenhinh = b.tenhinh WHERE a.giasp <= 10000000 AND sp.deletedAt IS NULL ORDER BY a.giasp DESC LIMIT ?, ?"; 
        } 
        else if(gia === "upper"){
            sql = "SELECT * FROM sanpham sp "+
            "INNER JOIN (SELECT masp, IF(giagiam > 0, giagiam, giaban) AS giasp FROM sanpham) a "+
            "ON sp.masp = a.masp INNER JOIN hinhanh ha ON sp.masp = ha.masp "+
            "INNER JOIN (SELECT masp, tenhinh FROM hinhanh GROUP BY masp) b ON ha.masp = b.masp "+
            "AND ha.tenhinh = b.tenhinh WHERE a.giasp >= 10000000 AND sp.deletedAt IS NULL ORDER BY a.giasp DESC LIMIT ?, ?"; 
        } 
        db.query(sql,[start, count], function(err, data){
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
// exports.getInfoUser = function(tentk, result){
//     let sql = "SELECT sodt, diachi FROM taikhoan WHERE tentk = ?";
//     db.query(sql,tentk,function(err, data){
//         if(err) throw err;
//         result(data);
//     });
// }

