const db = require('../Database')

exports.search = function(keyword){
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM sanpham WHERE tensp LIKE '%" + keyword + "%'";
        db.query(sql, function(err, data){
            if(err) reject(err);
            resolve(data);
        }); 
    });
}

exports.search1 = function(keyword, result){
        let sql = "SELECT * FROM sanpham WHERE tensp LIKE '%" + keyword + "%'";
        db.query(sql, function(err, data){
            if(err) throw err;
            result(data);
        });
}
exports.searchLimit = function(keyword, [start,count], result){
    let sql = "SELECT * FROM sanpham WHERE tensp LIKE '%" + keyword + "%' LIMIT ?, ?";
    db.query(sql,[start,count], function(err, data){
        if(err) throw err;
        result(data);
    });
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