const modelProduct = require('../../models/admin/Product');
const uploadFiles = require('../../middlewares/uploadFilesMiddleware');
const deleteImages =require('../../middlewares/deleteFilesMiddleware');
let debug = console.log.bind(console);

class ProductController {
    //[GET] /product
    index(req, res) {
        const listproduct = modelProduct.list();
        const countDeleted = modelProduct.countDeleted();
        Promise.all([listproduct, countDeleted])
            .then(([list, count_deleted]) =>
                res.render('product/list', {
                    list,
                    count_deleted
                }),
            )
            .catch(err =>{
                console.log("Có lỗi: " + err);
            })
    }

    //[GET] /product/trash
    trash(req, res) {
        modelProduct.listTrash()
            .then(list => {
                res.render('product/trash', {
                    list
                })
            })
            .catch(err => {
                console.log("Có lỗi: " + err);
            })
    }

    //[GET] /product/:id/detail
    detail(req, res) {
        let id = req.params.id;
        modelProduct.findId(id, function(resultId){
            if(resultId.length == 0){
                res.redirect('/admin/product');
            }
            else{
                const detailProduct = modelProduct.detail(id);
                const colorProduct = modelProduct.color(id);
                const specificationProduct = modelProduct.specification(id);
                const imagesProduct = modelProduct.images(id);
                Promise.all([detailProduct, colorProduct, specificationProduct, imagesProduct])
                    .then(([detail, color, specification, images]) =>
                        //res.json(color[0].tenmau)
                        //res.json(specification)
                        res.render('product/detail', {
                            detail,
                            color,
                            specification,
                            images,
                        }),
                    )
                    .catch(err =>{
                        console.log("Có lỗi: " + err);
                    })
            }
        })
    }

    //[GET] /product/create
    create(req, res){
        const listCategory = modelProduct.listCategory();
        const listBrand = modelProduct.listBrand();
        const listCoupon = modelProduct.listCoupon();
        const listColor = modelProduct.listColor();
        const listSpecification = modelProduct.listSpecification();
        Promise.all([listCategory, listBrand, listCoupon, listColor, listSpecification])
            .then(([listCate, listBr, listCoupon, listColor, listSpec]) => 
                res.render('product/create', {
                    listCate,
                    listBr,
                    listCoupon,
                    listColor,
                    listSpec,
                })
            )
            .catch(err => {
                console.log("Có lỗi:" + err);
            })
    }

    //[POST] /product/store
    async store(req, res){
        const listCategory = modelProduct.listCategory();
        const listBrand = modelProduct.listBrand();
        const listCoupon = modelProduct.listCoupon();
        const listColor = modelProduct.listColor();
        const listSpecification = modelProduct.listSpecification();
        try{
            await uploadFiles(req, res);
            //debug(req.files);
            if(req.files.length <= 0 ){
                //res.json(req.body.maloai == 'dslr');
                Promise.all([listCategory, listBrand, listCoupon, listColor, listSpecification])
                    .then(([listCate, listBr, listCoupon, listColor, listSpec])=>{
                        res.render('product/create', {
                            listCate,
                            listBr,
                            listCoupon,
                            listColor,
                            listSpec,
                            error: req.body,
                            message: 'Bạn phải chọn ít nhất 1 hình ảnh cho sản phẩm.'
                        })
                    })
                    .catch(err => {
                        console.log("Có lỗi:" + err);
                    })
            }
            else{
                modelProduct.findId(req.body.masp, function(result) {
                    if(result.length == 0) {
                        let product = req.body;
                        //res.json(Array.isArray(product.mausac));
                        let test = {
                            masp: product.masp,
                            tensp: product.tensp, 
                            giagoc: product.giagoc,
                            giagiam: product.giagiam,
                            giaban: product.giaban,
                            baohanh: product.baohanh,
                            xuatxu: product.xuatxu,
                            mota: product.mota,
                            soluong: product.soluong, 
                            maloai: product.maloai,
                            math: product.math, 
                            magg: product.magg, 
                            deletedAt: product.deletedAt,
                            createdAt:  new Date(),
                        };
                        test.deletedAt = null;
                        test.magg == "null" ? test.magg = null : test.magg;
                        modelProduct.create(test);
                        if(Array.isArray(product.mausac)){
                            product.mausac.forEach(color =>{
                                modelProduct.createColor(product.masp, color);
                            });
                        }
                        else{
                            modelProduct.createColor(product.masp, product.mausac);
                        }
                        //res.json(product);
                        let shouldSkip2 = false;
                        product.mats.forEach((mats, id) =>{
                            shouldSkip2 = false;
                            for(let i=0; i <= product.giatrits.length; i++) {
                                if(shouldSkip2){
                                    return;
                                } 
                                else if(i == id){
                                    modelProduct.createSpec(mats, product.masp, product.giatrits[i])
                                }
                                else{
                                    continue;
                                }
                                shouldSkip2 = true;
                            }
                        })
                        for (var i = 0; i < req.files.length ; i++){
                            let mahinh = req.files[i].filename;
                            modelProduct.createHA(mahinh, product.masp);
                        }
                        res.redirect('/admin/product');
                    }
                    else{
                        Promise.all([listCategory, listBrand, listCoupon, listColor, listSpecification])
                            .then(([listCate, listBr, listCoupon, listColor, listSpec])=>{
                                res.render('product/create', {
                                    listCate,
                                    listBr,
                                    listCoupon,
                                    listColor,
                                    listSpec,
                                    error: req.body,
                                    message: 'Trùng mã sản phẩm.'
                                })
                            })
                            .catch(err => {
                                console.log("Có lỗi:" + err);
                            })
                    }
                })
            }
            
        }
        catch (errors){
            //debug(errors);
            // Bắt luôn lỗi vượt quá số lượng file cho phép tải lên trong 1 lần
            if (errors.code === "LIMIT_UNEXPECTED_FILE") {
                Promise.all([listCategory, listBrand, listCoupon, listColor, listSpecification])
                            .then(([listCate, listBr, listCoupon, listColor, listSpec])=>{
                                res.render('product/create', {
                                    listCate,
                                    listBr,
                                    listCoupon,
                                    listColor,
                                    listSpec,
                                    error: req.body,
                                    message: 'Vượt quá số lượng file cho phép tải lên trong 1 lần.'
                                })
                            })
                            .catch(err => {
                                console.log("Có lỗi:" + err);
                            })
            }
            else{
                Promise.all([listCategory, listBrand, listCoupon, listColor, listSpecification])
                            .then(([listCate, listBr, listCoupon, listColor, listSpec])=>{
                                res.render('product/create', {
                                    listCate,
                                    listBr,
                                    listCoupon,
                                    listColor,
                                    listSpec,
                                    error: req.body,
                                    message: errors,
                                })
                            })
                            .catch(err => {
                                console.log("Có lỗi:" + err);
                            })
            }
        }
    }

    //[GET] /product/:id/edit
    edit(req, res) {
        let id = req.params.id;
        modelProduct.findId(id, function(resultId){
            if(resultId.length == 0){
                res.redirect('/admin/product');
            }
            else{
                const listCategory = modelProduct.listCategory();
                const listBrand = modelProduct.listBrand();
                const listCoupon = modelProduct.listCoupon();
                const listColor = modelProduct.listColor();
                const detailProduct = modelProduct.detail(id);
                const colorProduct = modelProduct.color(id);
                const specificationProduct = modelProduct.specification(id);
                const imagesProduct = modelProduct.images(id);
                Promise.all([listCategory, listBrand, listCoupon, listColor, detailProduct, colorProduct, specificationProduct, imagesProduct])
                    .then(([listCate, listBr, listCoupon, listColor,detail, color, specification, images]) =>
                        //res.json(color[0].tenmau)
                        //res.json(specification)
                        res.render('product/edit', {
                            listCate,
                            listBr,
                            listCoupon,
                            listColor,
                            detail: detail[0],
                            color,
                            specification,
                            images,
                        }),
                    )
                    .catch(err =>{
                        console.log("Có lỗi: " + err);
                    })
            }
        })
        
    }

    //[PUT] /product/:id
    async update(req, res){
        let id = req.params.id;
        const listCategory = modelProduct.listCategory();
        const listBrand = modelProduct.listBrand();
        const listCoupon = modelProduct.listCoupon();
        const listColor = modelProduct.listColor();
        const detailProduct = modelProduct.detail(id);
        const specificationProduct = modelProduct.specification(id);
        const imagesProduct = modelProduct.images(id);
        try{
            await uploadFiles(req, res);
            let product = req.body;
            let test = {
                masp: product.masp,
                tensp: product.tensp, 
                giagoc: product.giagoc,
                giagiam: product.giagiam,
                giaban: product.giaban,
                baohanh: product.baohanh,
                xuatxu: product.xuatxu,
                mota: product.mota,
                soluong: product.soluong, 
                maloai: product.maloai,
                math: product.math, 
                magg: product.magg, 
                deletedAt: product.deletedAt
            };
            test.deletedAt = null;
            test.magg == "null" ? test.magg = null : test.magg;
            modelProduct.update(test, test.masp);
            modelProduct.deleteColor(product.masp);
            if(Array.isArray(product.mausac)){
                product.mausac.forEach(color =>{
                    modelProduct.createColor(product.masp, color);
                });
            }
            else{
                modelProduct.createColor(product.masp, product.mausac);
            }
            //res.json(product);
            let shouldSkip2 = false;
            product.mats.forEach((mats, id) =>{
                shouldSkip2 = false;
                for(let i=0; i <= product.giatrits.length; i++) {
                    if(shouldSkip2){
                        return;
                    } 
                    else if(i == id){
                        //modelProduct.createSpec(mats, product.masp, product.giatrits[i])
                        modelProduct.updateSpec(product.giatrits[i], product.masp, mats)
                    }
                    else{
                        continue;
                    }
                    shouldSkip2 = true;
                }
            })
            modelProduct.findHA(product.masp, function(result){
                //res.json(result.length + 1);
                if(result.length == 6 && product.tenhinh == null ){
                    if(req.files.length > 0){
                        for (var i = 0; i < req.files.length; i++){
                            let mahinh = 'products/' + req.files[i].filename;
                            deleteImages.deleteFile(mahinh);
                        }
                    }
                }
            });
            if(product.tenhinh != null){
                if(Array.isArray(product.tenhinh)){
                    product.tenhinh.forEach(ten => {
                        let path = 'products/' +ten;
                        deleteImages.deleteFile(path);
                        modelProduct.deleteHAtheoten(ten);
                    })
                }
                else{
                    let path = 'products/' + product.tenhinh;
                    deleteImages.deleteFile(path);
                    modelProduct.deleteHAtheoten(product.tenhinh);
                }
            }
            modelProduct.findHA(product.masp, function(result){
                //res.json(result.length + 1);
                if(result.length < 6){
                    if(req.files.length > 0){
                        for (var i = 0; i < req.files.length ; i++){
                            let mahinh = req.files[i].filename;
                            modelProduct.createHA(mahinh, product.masp);
                        }
                    }
                }
            })
            res.redirect('/admin/product');
        }
        catch(errors){
            if (errors.code === "LIMIT_UNEXPECTED_FILE") {
                Promise.all([listCategory, listBrand, listCoupon, listColor, specificationProduct, imagesProduct, detailProduct])
                            .then(([listCate, listBr, listCoupon, listColor, specification, images, detail])=>{
                                res.render(`product/edit`, {
                                    listCate,
                                    listBr,
                                    listCoupon,
                                    listColor,
                                    specification, 
                                    images,
                                    detail: detail[0],
                                    error: req.body,
                                    message: 'Vượt quá số lượng file cho phép tải lên trong 1 lần.'
                                })
                            })
                            .catch(err => {
                                console.log("Có lỗi:" + err);
                            })
            }
            else{
                Promise.all([listCategory, listBrand, listCoupon, listColor, specificationProduct, imagesProduct, detailProduct])
                    .then(([listCate, listBr, listCoupon, listColor, specification, images ,detail])=>{
                        res.render(`product/edit`, {
                            listCate,
                            listBr,
                            listCoupon,
                            listColor,
                            specification, 
                            images,
                            detail: detail[0],
                            error: req.body,
                            message: errors,
                        })
                    })
                    .catch(err => {
                        console.log("Có lỗi:" + err);
                    })
            }
            
        }
    }

    //[DELETE] /product/id
    delete(req, res) {
        let id = req.params.id;
        modelProduct.findFK(id, function(resultFK){
            if(resultFK.length == 0){    
                let date = new Date();
                modelProduct.delete(date, id);
                res.redirect('/admin/product');
            }
            else{
                const listproduct = modelProduct.list();
                const countDeleted = modelProduct.countDeleted();
                Promise.all([listproduct, countDeleted])
                    .then(([list, count_deleted]) =>
                        res.render('product/list', {
                            list,
                            count_deleted,
                            error: resultFK
                        }),
                    )
                    .catch(err =>{
                        console.log("Có lỗi: " + err);
                    })
            }
        })
    }

    //[PATCH] /product/id/restore
    restore(req, res){
        let id = req.params.id;
        let date = null;
        modelProduct.restore(date, id);
        res.redirect('/admin/product/trash');
    }

    //[DELETE] /product/id/force
    forceDelete(req, res){
        let id = req.params.id;
        modelProduct.findtenHA(id, function(result){
            for(let i = 0; i < result.length; i++){
                let path = 'products/' +result[i].tenhinh;
                deleteImages.deleteFile(path);
            }
        });
        modelProduct.deleteColor(id);
        modelProduct.deleteSpec(id);
        modelProduct.deleteHA(id);
        modelProduct.forceDelete(id);
        res.redirect('/admin/product/trash');
    }
}

module.exports = new ProductController;