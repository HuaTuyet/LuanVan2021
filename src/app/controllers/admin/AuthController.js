const modelAuth = require('../../models/admin/Auth');
const bcrypt = require('bcryptjs');

class AuthController {
    index(req, res) {
        res.render('auth/login');
    }

    login(req, res) { 
        let email = req.body.email;
        let matkhau = req.body.matkhau;
        modelAuth.getAdmin(email, async function(resultAuth) {
            //res.json(resultAuth);
            if(resultAuth.length == 0 || !(await bcrypt.compare(matkhau, resultAuth[0].matkhau))){
                res.render('auth/login', {
                    error: "Email hoặc mật khẩu không đúng"
                })
            }
            else{
                req.session.loggedin = true;
                req.session.tenadmin = resultAuth[0].tenadmin;
                console.log(req.session.tenadmin);
                res.redirect('/admin');
                // res.render('home',{
                //     tenadmin: req.session.tenadmin
                // });
            }
        })
    }

    logout(req, res){
        req.session.destroy();
        res.redirect('/admin');
    }
}

module.exports = new AuthController;