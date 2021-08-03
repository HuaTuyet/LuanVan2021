const modelAuth = require('../../models/customer/Auth');
const uploadFile = require('../../middlewares/uploadFileMiddleware');
const deleteImage = require('../../middlewares/deleteFilesMiddleware');
const bcrypt = require('bcryptjs');
let debug = console.log.bind(console);
//const bcrypt = require('bcryptjs');

class AuthController{
    // GET / tai-khoan || tai-khoan / :slug
    viewLogin(req, res){
        res.render('auth/loginC');
    }

    // GET / tai-khoan / dang-ky
    viewRegister(req, res){
        res.render('auth/register');
    }

    // POST / tai-khoan / store - Đăng kí
    async store(req, res){
        await uploadFile(req, res, (error) =>{
            if (error) {
                return res.send(`Error when trying to upload: ${error}`);
            }
            debug(req.file);
            let anhdd = null;
            if (req.file != undefined) {
                anhdd = req.file.filename;
            }
            let patt = /^[\d\w_]+$/g;
            let validUserName = patt.test(req.body.tentk);
            if(!validUserName){
                res.render('auth/register', {
                    taikhoan: req.body,
                    error: "Tên tài khoản chỉ bao gồm chữ, số và dấu gạch dưới"
                })
            } 
            else {
                modelAuth.checkEmail(req.body.email, function(resultEmail){
                    modelAuth.checkTentk(req.body.tentk, async function(resultTentk){
                        if(resultTentk.length > 0){
                            res.render('auth/register', {
                                taikhoan: req.body,
                                error: "Tên tài khoản này đã tồn tại"
                            })
                        }
                        else if(resultEmail.length > 0){
                            res.render('auth/register', {
                                taikhoan: req.body,
                                error: "Email này đã được đăng ký"
                            })
                        }
                        else if(req.body.matkhau !== req.body.xacnhanmatkhau){
                            res.render('auth/register', {
                                taikhoan: req.body,
                                error: "2 mật khẩu không giống nhau"
                            })
                        }
                        else{
                            let hashPassword = await bcrypt.hash(req.body.matkhau, 8);
                            const taikhoan = {
                                tentk: req.body.tentk,
                                sodt: req.body.sodt,
                                diachi: req.body.diachi,
                                anhdd: anhdd,
                                email: req.body.email,
                                matkhau: hashPassword,
                            }
                            modelAuth.create(taikhoan);
                            res.redirect('/tai-khoan');
                        }
                    })
                })
            }
        });   
    }

    // POST / tai-khoan / login
    login(req, res) {
        let email = req.body.email;
        let matkhau = req.body.matkhau; 
        if(!email || !matkhau){
            res.render('auth/loginC', { 
                error: "Xin hãy cung cấp email và mật khẩu"
            })
        }
        else{
            modelAuth.getUsers(email, async function(resultUser){
                console.log(resultUser);  
                if(resultUser.length == 0){
                    res.status(401).render('auth/loginC', {
                        error: "Email không đúng!",
                        taikhoan: req.body,
                    })
                }
                else if(!(await bcrypt.compare(matkhau, resultUser[0].matkhau))){
                    res.status(401).render('auth/loginC', {
                        error: "Mật khẩu không đúng!", 
                        taikhoan: req.body,
                    })
                }
                else{
                    let session =req.session;
                    session.login = true;
                    session.user = {
                        tentk : resultUser[0].tentk,
                        email : resultUser[0].email,
                        sodt : resultUser[0].sodt,
                        diachi : resultUser[0].diachi,
                        anhdd : resultUser[0].anhdd,
                    };
                    console.log(req.session);
                    if (session.back){ 
                        console.log(session.back);
                        res.redirect(session.back);
                    }
                    else {
                        let redirectTo = req.session.redirectTo ? req.session.redirectTo : '/'
                        res.redirect(redirectTo);
                        //res.redirect('back');
                    }
                }
            })
        }
    }

    logout(req, res){ 
        req.session.destroy();
        res.redirect('/');
    }

    // GET / tai-khoan / me
    viewAccount(req, res){
        let tentk = req.session.user.tentk;
        modelAuth.getUsersByTentk(tentk, function(resultUser){
            res.render('auth/account', {taikhoan: resultUser});
        })
    }

    // GET / tai-khoan / me / cap-nhat
    viewUpdateAccount(req, res){
        res.render('auth/update', {taikhoan: req.session.user});
    }
    // POST / tai-khoan / me / cap-nhat
    async updateAccount(req, res){
        await uploadFile(req, res, (error) =>{
            if (error) {
                return res.send(`Error when trying to upload: ${error}`);
            }
            debug(req.file);
            let anhdd = req.session.user.anhdd;
            let anhddOld = '';
            if (req.file != undefined) {
                anhdd = req.file.filename;
                anhddOld = req.session.user.anhdd;
            }
            modelAuth.checkEmailUpdate(req.session.user.tentk, function(resultEmail){
                let ckEmail = false;
                for(let i in resultEmail){
                    if(resultEmail[i] == req.body.email){
                        ckEmail = true; break
                    }
                }
                        if(ckEmail){
                            res.render('auth/update', {
                                taikhoan: req.body,
                                error: "Email này đã được đăng ký!"
                            })
                        }
                        else{
                            let user = [];
                            user.push(req.body.email);
                            user.push(req.body.sodt);
                            user.push(req.body.diachi);
                            user.push(anhdd);
                            user.push(req.session.user.tentk);
                            modelAuth.update(user, function(result){
                                if(result > 0){
                                    if(anhddOld){
                                        let path = "auths/" + anhddOld;
                                        deleteImage.deleteFile(path);
                                    }
                                    req.session.user.email = req.body.email;
                                    req.session.user.sodt = req.body.sodt;
                                    req.session.user.diachi = req.body.diachi;
                                    req.session.user.anhdd = anhdd;
                                    res.redirect('/tai-khoan/me');
                                }
                                else{
                                    res.render('auth/update', {
                                        taikhoan: req.body,
                                        error: "Có lỗi xảy ra. Không thể cập nhật tài khoản lúc này!"
                                    })
                                }
                            });
                        }
                })
        }); 
    }

    // GET / tai-khoan / me / doi-mat-khau
    viewChangePw(req, res){
        res.render('auth/changePassword');
    }
    // POST / tai-khoan / me / doi-mat-khau
    changePw(req, res){
        //let old = req.body;
        if(req.body.matkhaumoi != req.body.matkhaunhaplai){
            res.render('auth/changePassword', {error: "Mật khẩu nhập lại không trùng!"});
        } 
        else{
            let tentk = req.session.user.tentk; 
            modelAuth.getUsersByTentk(tentk,async function(user){
                if(!(await bcrypt.compare(req.body.matkhaucu, user.matkhau))){
                    res.render('auth/changePassword', {error: "Mật khẩu cũ không đúng!"});
                }
                else{
                    console.log("trung mat khau cu");
                    let newPw = await bcrypt.hash(req.body.matkhaumoi, 8); console.log('newPw: ', newPw);
                    modelAuth.changePassword(newPw ,tentk, function(data){
                        if(data > 0){
                            res.render('auth/changePassword', {success: true});
                        }
                        else{
                            res.render('auth/changePassword', {error: "Không thể đổi mật khẩu lúc này!"});
                        }
                    })
                }
            }) 
        }
    }
}

// -- /^[\d\w_.]+$/g --

module.exports = new AuthController;