const Cart = require('../../models/customer/Cart');
const modelProduct = require('../../models/customer/Product')
const modelOrder = require('../../models/customer/Order')
function formatDate(date){
	return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() +
    ':' + date.getMinutes() + ':' + date.getSeconds();
}

class OrderController{
    // GET / thanh-toan
    viewPay(req, res){
        let cart = new Cart(req.session.cart ? req.session.cart : {});
        if(cart && Object.keys(cart.items).length !== 0){
            modelProduct.getDelivery(function(dataQuery){
                let cart = new Cart(req.session.cart ? req.session.cart : {});
                let arrCart = cart.generateArray();
                let totalQty = cart.totalQty;
                let totalPrice = cart.totalPrice;
                let delivery = dataQuery;
                //res.json({arrCart, totalQty, totalPrice, delivery});          
                res.render('pay', {arrCart, totalQty, totalPrice, delivery});
            });
        }
        else{
            res.render('pay', {emptyCart:true});
        }
    }

    // POST / dat-hang
    createOrder(req, res){
        let dataForm = req.body; //console.log('data form đặt hàng: ', dataForm); 

        if(dataForm['radPayment'] == "vnpay"){
            req.session.tongtien = dataForm['tongtien'];
            res.redirect('/create_payment_url');
            return;
        }

        let cart = new Cart(req.session.cart ? req.session.cart : {});
        if(cart && Object.keys(cart.items).length !== 0){
            let arrCart = cart.generateArray();
            let dh = [], rowDetail = [], details = [];
            const today = new Date(); //console.log(today.getMinutes());
            dh.push('DH' + today.getTime());
            for( let i in arrCart){
                rowDetail[i] = [dh[0], arrCart[i].item.masp, arrCart[i].qty, arrCart[i].price];
                details.push(rowDetail[i]);
            };
            //console.log('details: ', details);
            modelProduct.getDelivery(function(data){
                let vc = dataForm['radDelivery']
                for(let i in data){
                    if(data[i].phivc == vc){
                        vc = data[i].mavc;
                    }
                }
                let donhang = {
                    madh: 'DH' + today.getTime(),
                    ngaydat: formatDate(today),
                    tenkh: dataForm['tenkh'],
                    sodt: dataForm['sodt'],
                    diachi: dataForm['diachi'],
                    ghichu: dataForm['ghichu'],
                    phivc: dataForm['radDelivery'], 
                    giamgia: dataForm['giamgia'],  
                    tongtien: dataForm['tongtien'],
                    trangthai: 0,
                    hinhthuctt: dataForm['radPayment'],
                    mavc: vc,
                    tentk: req.session.user.tentk,
    
                }; 
                console.log('don hang: ', donhang);
                modelOrder.createOrder(donhang);
                modelOrder.createOrderDetail(details, function(data){
                    if(data > 0){
                        let operator = "subtrac";
                        for( let i in details){
                            console.log('test: ', details[i][1]);
                            modelOrder.updateQuantiy([details[i][2], details[i][1]], operator)
                        };
                    }
                });
            })
            //res.json({dataForm, cart: cart.generateArray()});
            res.redirect('/don-mua');
        };
    }

    // GET / don-mua
    getMyOrder(req, res){
        let tentk = req.session.user.tentk;
        const dh = modelOrder.getOrder(tentk);
        dh.then((dhList)=>{
            res.render('myorder', {dhList});
        })
    }

    // GET / don-mua / thong-tin-don-hang / :id
    getMyOrderDetail(req, res){
        let madh = req.params.id;
        const dh = modelOrder.getOneOrder(madh);
        const ctdh = modelOrder.getOrderDetail(madh);
        Promise.all([dh, ctdh])
            .then(([dh, ctdh]) => {
                let tienhang = ctdh.reduce((total, currentValue) => {
                    total += (currentValue.soluong*currentValue.dongia);
                    return total;
                },0);
                // console.log('dh: ', dh);
                // console.log('ctdh: ', ctdh); console.log('tien hang: ', tienhang);
                res.render('myorder', {dh, ctdh, tienhang});
            })
    }

    // GET / don-mua / huy-don / :id
    destroyOrder(req, res){
        let madh = req.params.id; //console.log('Huy don: ', madh);
        const dh = modelOrder.getOneOrder(madh);
        dh.then((dh) => {
            if(dh.trangthai == 0){
                const huy = modelOrder.destroyOrder(madh);
                huy.then((affectedRows) => {
                    //console.log('affeted: ', affectedRows);
                    if(affectedRows > 0){
                        modelOrder.fnGetOrderDetail(madh, function(details){
                            let operator = "add";
                            for( let i in details){
                                console.log('test: ', details[i].masp);
                                modelOrder.updateQuantiy([details[i].soluong, details[i].masp], operator)
                            };
                        })
                    }
                    res.redirect('back');
                });
            }
        }); 
    }

    // GET / create_payment_url
    createPaymentUrl(req, res) {
        res.render('vnpay', {amount: req.session.tongtien})
    }

    // POST / create_payment_url
    createPaymentUrlPost(req, res, next) {
        var ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    
        var config = require('../../../config/default.json');
        
        var dateFormat = require('dateformat');
    
        
        // var tmnCode = config.get('vnp_TmnCode');
        // var secretKey = config.get('vnp_HashSecret');
        // var vnpUrl = config.get('vnp_Url');
        // var returnUrl = config.get('vnp_ReturnUrl');
        var tmnCode = config['vnp_TmnCode'];
        var secretKey = config['vnp_HashSecret'];
        var vnpUrl = config['vnp_Url'];
        var returnUrl = config['vnp_ReturnUrl'];
    
        var date = new Date();
    
        var createDate = dateFormat(date, 'yyyymmddHHmmss');
        var orderId = 'DH' + date.getTime();
        var amount = req.body.amount;
        var bankCode = req.body.bankCode;
        
        // var orderInfo = req.body.orderDescription;
        // var orderType = req.body.orderType;
        // var locale = req.body.language;
        // if(locale === null || locale === ''){
        //     locale = 'vn';
        // }
        var currCode = 'VND';
        var vnp_Params = {};
        vnp_Params['vnp_Version'] = '2';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'noi dung thanh toan';
        vnp_Params['vnp_OrderType'] = 'camera';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if(bankCode !== null && bankCode !== ''){
            vnp_Params['vnp_BankCode'] = bankCode;
        }
    
        vnp_Params = sortObject(vnp_Params);
    
        var querystring = require('query-string');
        var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });
    
        var sha256 = require('sha256');
    
        var secureHash = sha256(signData);
    
        vnp_Params['vnp_SecureHashType'] =  'SHA256';
        vnp_Params['vnp_SecureHash'] = secureHash;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true }); 
        console.log('vnpUrl: ', vnpUrl);
    
        //Neu muon dung Redirect thi dong dong ben duoi
        res.status(200).json({code: '00', data: vnpUrl})
        //Neu muon dung Redirect thi mo dong ben duoi va dong dong ben tren
        //res.redirect(vnpUrl)
    }
}

function sortObject(o) {
    var sorted = {},
        key, a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}

module.exports = new OrderController;
