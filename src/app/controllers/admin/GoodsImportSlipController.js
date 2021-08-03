const modelGoodsImportSlip = require('../../models/admin/GoodsImportSlip');
const Cart = require('../../models/admin/Cart');

class GoodsImportSlipController {
    //[GET] /goodsimportslip/
    index(req, res){
        const list = modelGoodsImportSlip.list()
            .then(list =>{
                if(req.session.cart){
                    delete req.session.cart;
                }
                res.render('goods_import_slip/list', {
                    list
                });
            })
            .catch(err =>{
                console.log("Có lỗi " + err);
            })
    }

    //[GET] /goodsimportslip/:id/detail
    detail(req, res){
        let id = req.params.id;
        const detail = modelGoodsImportSlip.detail(id);
        const product = modelGoodsImportSlip.productDetailSlip(id);
        Promise.all([detail, product])
            .then(([detail, product]) =>{
                res.render('goods_import_slip/detail', {
                    detail,
                    product
                })
            })
            .catch(err =>{
                console.log("Có lỗi: "+ err)
            })
    }

    //[GET] /goodsimportslip/create
    create(req, res){
        const listProduct = modelGoodsImportSlip.listProduct();
        const listVendor = modelGoodsImportSlip.listVendor();
        Promise.all([listProduct, listVendor])
            .then(([listProduct, listVendor]) =>{
                if (!req.session.cart) {
                    return res.render('goods_import_slip/create', {
                        listProduct,
                        listVendor,
                    });
                }
                let cart = new Cart(req.session.cart);
                res.render('goods_import_slip/create', {
                    listProduct,
                    listVendor,
                    products: cart.getItems(),
                    totalPrice: cart.totalPrice,
                });
            })
            .catch((err) =>{
                console.log("Có lỗi hiển thị tạo phiếu nhập: " + err)
            })
    }

    //[GET] /goodsimportslip/add/:id/
    add(req, res){
        let productId = req.params.id;
        let cart = new Cart(req.session.cart ? req.session.cart : {});
        modelGoodsImportSlip.product(productId, function(result){
            let product = result[0];
            //res.json(product);
            cart.add(product, product.masp);
            req.session.cart = cart;
            console.log(req.session.cart);
            res.redirect('back');
        })
    }

    //[DELETE] /goodsimportslip/remove/:id
    remove(req, res) {
        let productId = req.params.id;
        let cart = new Cart(req.session.cart ? req.session.cart : {});
        cart.remove(productId);
        req.session.cart = cart;
        res.redirect('back');
    }

    //[PUT] /goodsimportslip/update
    update(req, res) {
        let test = req.body;
        let shouldSkip2 = false;
        if(Array.isArray(test.masp)){
            test.masp.forEach((masp, id) => {
                shouldSkip2 = false;
                for(let i=0; i <= test.quantity.length; i++){
                    if(shouldSkip2){
                        return;
                    } 
                    else if(i == id){
                        let cart = new Cart(req.session.cart ? req.session.cart : {});
                        cart.updateQuantity(masp, test.quantity[i]);
                        req.session.cart = cart;
                    }
                    else{
                        continue;
                    }
                    shouldSkip2 = true;
                }
            })
        }
        else{
            let cart = new Cart(req.session.cart ? req.session.cart : {});
            cart.updateQuantity(test.masp, test.quantity);
            req.session.cart = cart;
        }
        res.redirect('back');
        console.log(req.session.cart);
    }

    //[POST] /goodsimportslip/store
    store(req, res){
        if (!req.session.cart) {
            res.redirect('/admin/goodsimportslip/create');
        }
        let slip = {
            mapn:  new Date().valueOf(),
            ngaynhap: new Date(),
            tongtien: req.session.cart.totalPrice,
            mancc: req.body.mancc,
        }
        modelGoodsImportSlip.create(slip);
        //let detailSlip =[];
        let cart = new Cart(req.session.cart);
        let products = cart.getItems();
        for (let i = 0; i < products.length; i++) {
            let detailSlip = {
                mapn: slip.mapn,
                masp: products[i].item.masp,
                soluong: products[i].quantity,
                dongia: products[i].item.giagoc,
            }
            modelGoodsImportSlip.createDetailSlip(detailSlip);
            modelGoodsImportSlip.increaseProductQuantity(detailSlip.soluong, detailSlip.masp)
        }
        delete req.session.cart;
        res.redirect('/admin/goodsimportslip');
    }

    //[GET] /goodsimportslip/:id/edit
    edit(req, res){
        // if(req.session.cart){
        //     delete req.session.cart;
        // }
        let id = req.params.id;
        let mancc = "";
        modelGoodsImportSlip.getPN(id, function(result){
            if (!req.session.cart) {
                for(let i = 0; i < result.length; i++){
                    let cart = new Cart(req.session.cart ? req.session.cart : {});
                    cart.getCart(result[i], result[i].masp);
                    req.session.cart = cart;
                }
            }
            mancc = result[0].mancc;
            console.log(req.session.cart);
        })
        const listProduct = modelGoodsImportSlip.listProduct();
        const listVendor = modelGoodsImportSlip.listVendor();
        Promise.all([listProduct, listVendor])
            .then(([listProduct, listVendor])=>{
                let cart = new Cart(req.session.cart);
                res.render('goods_import_slip/edit', {
                    listProduct,
                    listVendor,
                    idSlip: id,
                    mancc: mancc,
                    products: cart.getItems(),
                    totalPrice: cart.totalPrice,
                });
            })
            .catch((err) =>{
                console.log("Có lỗi edit: " + err)
            });
    }

    //[PUT] /goodsimportslip/:id
    updateSlip(req, res){
        let totalSlip = req.session.cart.totalPrice;
        let idVendor = req.body.mancc;
        let id = req.params.id;
        modelGoodsImportSlip.updateSlip(totalSlip, idVendor, id);
        modelGoodsImportSlip.getQuantityDetailSlip(id, function(result){
            for(let i = 0; i < result.length; i++){
                modelGoodsImportSlip.reduceProductQuantity(result[i].soluong, result[i].masp);
            }
        })
        modelGoodsImportSlip.deleteDetailSlip(id);
        let cart = new Cart(req.session.cart);
        let products = cart.getItems();
        for (let i = 0; i < products.length; i++) {
            let detailSlip = {
                mapn: id,
                masp: products[i].item.masp,
                soluong: products[i].quantity,
                dongia: products[i].item.giagoc,
            }
            modelGoodsImportSlip.createDetailSlip(detailSlip);
            modelGoodsImportSlip.increaseProductQuantity(detailSlip.soluong, detailSlip.masp)
        }
        delete req.session.cart;
        res.redirect('/admin/goodsimportslip');
    }

}

module.exports = new GoodsImportSlipController;