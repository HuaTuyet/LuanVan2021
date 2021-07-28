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