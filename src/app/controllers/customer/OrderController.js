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
        let cart = new Cart(req.session.cart ? req.session.cart : {});
        if(cart && Object.keys(cart.items).length !== 0){
            let dataForm = req.body; console.log('data form đặt hàng: ', dataForm); 
            let arrCart = cart.generateArray();
            let dh = [], rowDetail = [], details = [];
            let today = new Date(); console.log("Ngày đặt: ", today);
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
                    ngaydat: today,
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
                console.log('don hang: ', donhang.ngaydat);
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
            req.session.cart = null;
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
} 

module.exports = new OrderController;
