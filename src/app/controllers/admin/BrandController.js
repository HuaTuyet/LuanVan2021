const modelBrand = require('../../models/admin/Brand');
const uploadFile = require('../../middlewares/uploadFileMiddleware');
const deleteImages = require('../../middlewares/deleteFilesMiddleware')
let debug = console.log.bind(console);

class BrandController {
    //[GET] /brand/
    index(req, res){
        const listbrand = modelBrand.list();
        const countDeleted = modelBrand.countDeleted();
        Promise.all([listbrand, countDeleted])
            .then(([list, count_deleted]) =>
                res.render('brand/list', {
                    list,
                    count_deleted
                }),
            )
            .catch(err =>{
                console.log("Có lỗi: " + err);
            })
    }

    //[GET] /brand/trash
    trash(req, res) {
        modelBrand.listTrash()
            .then(listTrash => 
                res.render('brand/trash', {
                    list: listTrash
                }),
            )
            .catch(err => {
                console.log("Có lỗi: " + err)
            })
    }

    //[GET] /brand/create
    create(req, res){
        res.render('brand/create');
    }

    //[POST] /brand/store
    async store(req, res){
        await uploadFile(req, res, (error) =>{
            debug(req.file);
            //res.json(req.body);
            if (error) {
                return res.render('brand/create', {
                    message: error,
                    error: req.body,
                })
            }
            if(req.file == undefined){
                return res.render('brand/create', {
                    message: "Bạn phải chọn 1 hình ảnh cho thương hiệu.",
                    error: req.body,
                })
            }
            let brand = {
                math: req.body.math,
                tenth: req.body.tenth
            }
            brand.tenhinh = req.file.filename;
            //res.json(brand)
            let id = req.body.math;
            modelBrand.findId(id, function(resultId){
                if(resultId.length == 0){
                    modelBrand.create(brand);
                    res.redirect('/admin/brand');
                }
                else{
                    res.render('brand/create', {
                        error: brand,
                        message: 'Trùng mã thương hiệu.'
                    });
                }
            })
        });
        
    }

    //[GET] /brand/id/edit
    edit(req, res){
        let id = req.params.id;
        modelBrand.findId(id, function(resultId){
            if(resultId.length == 0){
                res.redirect("/admin/brand")
            }
            else{
                modelBrand.detail(id)
                    .then(brand =>
                        res.render('brand/edit', { 
                            brand: brand[0] 
                        })
                    )
                    .catch(err => {
                        console.log("Có lỗi: ", err);
                    })
            }
        })
        
    }

    //[PUT] /brand/:id
    async update(req, res){
        await uploadFile(req, res, (error) =>{
            debug(req.file);
            let brand = {
                math: req.body.math,
                tenth: req.body.tenth
            }
            let id = req.params.id;
            if(req.file != undefined){
                brand.tenhinh = req.file.filename;
                modelBrand.detail(id)
                    .then(brand => {
                        let path = "brands/" + brand[0].tenhinh;
                        deleteImages.deleteFile(path); 
                    })
                    .catch(err => {console.log('có lỗi!!' + err)})
            }
            modelBrand.update(brand, id);
            res.redirect("/admin/brand");
        });
    }

    //[DELETE] /brand/:id
    delete(req, res){
        let id = req.params.id;
        let date = new Date();
        modelBrand.findFK(id, function(resultFK){
            if(resultFK.length == 0){
                modelBrand.delete(date, id);
                res.redirect("/admin/brand");
            }
            else{
                const listbrand = modelBrand.list();
                const countDeleted = modelBrand.countDeleted();
                Promise.all([listbrand, countDeleted])
                    .then(([list, count_deleted]) =>
                        res.render('brand/list', {
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

    //[PATCH] /brand/:id/restore
    restore(req, res){
        let id = req.params.id;
        let date = null;
        modelBrand.restore(date, id);
        res.redirect('/admin/brand/trash');
    }

    //[DELETE] /brand/:id/force
    forceDelete(req, res){
        let id = req.params.id;
        modelBrand.detail(id)
                .then(brand => {
                    let path = "brands/" + brand[0].tenhinh; console.log('path: ', path)
                    deleteImages.deleteFile(path); 
                })
                .catch(err => {console.log('có lỗi!!' + err)})
        modelBrand.forceDelete(id);
        res.redirect('/admin/brand/trash');
    }
}

module.exports = new BrandController;