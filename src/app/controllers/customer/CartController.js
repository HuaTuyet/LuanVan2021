const Cart = require('../../models/customer/Cart');
const modelProduct = require('../../models/customer/Product')
const modelOrder = require('../../models/customer/Order')

class CartController {
    // GET / gio-hang 
    viewCart(req, res){
            let cart = new Cart(req.session.cart ? req.session.cart : {});
            if(cart && Object.keys(cart.items).length !== 0){
                let arrCart = cart.generateArray();
                let totalQty = cart.totalQty;
                let totalPrice = cart.totalPrice;
                //res.json({arrCart, totalQty, totalPrice, delivery});          
                res.render('cart', {arrCart, totalQty, totalPrice});
            } else {
                res.render('cart', {emptyCart:true});
            };

            // modelProduct.getDelivery(function(dataQuery){
            //     let cart = new Cart(req.session.cart ? req.session.cart : {});
            //     let arrCart = cart.generateArray();
            //     let totalQty = cart.totalQty;
            //     let totalPrice = cart.totalPrice;
            //     let delivery = dataQuery;
            //     //res.json({arrCart, totalQty, totalPrice, delivery});          
            //     res.render('cart', {arrCart, totalQty, totalPrice, delivery});
            // });
    } 

    // POST / gio-hang / add 
    addCart(req, res){
        req.session.redirectTo = req.body.currentPath;
        let productId = req.body.masp; console.log('masp: ', productId);
        let productQty = Number(req.body.productQty); console.log('qty o trang detail: ', productQty);
        let cart = new Cart(req.session.cart ? req.session.cart : {});
        let add = false;
        let oldQty = cart.totalQty;
    
        modelProduct.getAProduct(productId, function(product){
            cart.add(product, product.masp, productQty);
            console.log('cart - add: ', cart);
            let newQty = cart.totalQty; 
            if(oldQty < newQty){
                add = true;
            }
            req.session.cart = cart; console.log(req.session);
            res.json({cart, add, login: true});         
        }) 
    }  

    // GET / gio-hang / delete /:id
    deleteCart(req, res){
        let productId = req.params.id;
        let cart = new Cart(req.session.cart ? req.session.cart : {});
        //let previousUrl = req.query.currentUrl;
        cart.delete(productId);
        // console.log('cart - delete: ', cart);
        req.session.cart = cart;
        if(req.session.login){
            res.redirect('/thanh-toan');
        }
        else{
            res.redirect('/gio-hang');
        }
    }

    // GET / gio-hang / update /:id
    updateCart(req, res){
        let qty = req.query.qty;
        let productId = req.params.id; 
        let cart = new Cart(req.session.cart ? req.session.cart : {});
        cart.update(productId, qty); 
        // console.log('cart - update: ', cart);
        //console.log(cart.items[productId].price);
        req.session.cart = cart;
        res.json({
            item: cart.items[productId],
            totalQty: cart.totalQty, 
            totalPrice : cart.totalPrice
        });  
        //res.redirect('/gio-hang');
       
    }

    // POST / gio-hang / khuyen-mai
    discount(req, res){
        let error = '';
        let magg = req.body.magg;
        let day = new Date(req.body.day);
        let p = {};
        let products = req.session.cart ? req.session.cart.items : null;
        if(products && Object.keys(products).length !== 0){ 
            let flag = false;
            for(let k in products){ 
                if(products[k].item.magg === magg) {
                    flag = true;
                    break;
                }
            }
            // Flag == true -> Sản phẩm có mã giảm giá trùng với magg nhập vào
            if(flag){
                const discount = modelOrder.getDiscount(magg);
                discount.then((discount) => {
                    let giamgia = 0;
                    if(discount.ngayketthuc.getTime() > day.getTime() && discount.ngayapdung.getTime() < day.getTime()){
                        console.log('so sanh ngay dc');
                        if(discount.hinhthucgiam == 0){
                            // Giảm theo %
                            giamgia = Number(req.session.cart.totalPrice) * Number(discount.mucdo) / 100;
                        } else { // Giảm theo số tiền
                            giamgia = Number(discount.mucdo);
                        }  
                        res.json({giamgia});
                    }
                    else{
                        error = 'Mã giảm giá đã hết hạn!';
                        res.json({error}); 
                    }
                })
            } else {
                error = 'Mã giảm giá không đúng. Bạn thử lại nhé!';
                res.json({error});
            }
        } else { 
            error = 'Bạn không thể dùng mã giảm giá khi chưa mua sản phẩm nào!';
            res.json({error});
        };
    }
}

module.exports = new CartController;