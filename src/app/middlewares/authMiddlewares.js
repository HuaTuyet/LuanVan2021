const modelAuth = require('../models/admin/Auth');

module.exports.requireAuth = function(req, res, next) { 
    if(!req.session.loggedin){
        res.redirect('/admin/auth');
        return; // phải return ko thì nó sẽ chạy logic của nó
    }
    
    // modelAuth.getAdmin(req.session.tenadmin, function(resultAuth){
    //     if(resultAuth.length == 0){
    //         res.redirect('/auth/login');
    //         return;
    //     }
    // })

    next();
};

module.exports.requireAuthCustomer = function(req, res, next) { 
    if(!req.session.login){
        res.redirect('/tai-khoan');
        return; // phải return ko thì nó sẽ chạy logic của nó
    }
    next();
};