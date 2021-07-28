const modelCategory = require('../../models/admin/Category');

class CategoryController{
    //[GET] /category/
    index(req, res){

        const listCat = modelCategory.list();
        const countDeleted = modelCategory.countDeleted();
        Promise.all([listCat, countDeleted])
            .then(([list, count_deleted]) => 
                res.render('category/list',{
                    list,
                    count_deleted
                }),
            )
            .catch(err => {
                console.log("Có lỗi: ", err);
            })

        // modelCategory.list(function(resultList){
        //     modelCategory.countDeleted(function(resultCount){
        //         let listCat = resultList;
        //         let countDeleted = resultCount;
        //         //res.json(countDeleted);
        //         res.render('category/list', { //list là chỉ file list.hbs trong thư mục category
        //             list: listCat,
        //             count_deleted: countDeleted
        //         })
        //     });
        // });
    }

    //[GET] /category/trash
    trash(req, res){

        modelCategory.listTrash()
            .then(listTrash => 
                //res.json(category)
                res.render('category/trash', { 
                    list: listTrash 
                })
            )
            .catch(err => {
                console.log("Có lỗi: ", err);
            })

        // modelCategory.listTrash(function(resultQuery){
        //     let listTrash = resultQuery;
        //     //res.json(listCat);
        //     res.render('category/trash', { //trash là chỉ file trash.hbs trong thư mục category
        //         list: listTrash
        //     });
        // });
    }

    //[GET] /category/create
    create(req, res) {
        res.render('category/create'); //Đây là file create.hbs
    }

    //[POST] /category/store
    store(req, res){
        let category = req.body;
        let id = req.body.maloai;        
        modelCategory.findId(id ,function(resultId){
            if(resultId.length == 0){
                modelCategory.create(category);
                res.redirect("/admin/category");
            }
            else{
                res.render('category/create', {
                    error: category
                });
            }
        })
    }

    //[GET] /category/:id/edit
    edit(req, res) {
        // let id = req.params.id;
        // modelCategory.detail(id, function(resultDetail) {
        //     //let category = resultQuery;
        //     //res.json(resultDetail);
        //     res.render('category/edit', { //edit là chỉ file edit.hbs trong thư mục category
        //         cate: resultDetail
        //     });
        // })

        let id = req.params.id;
        modelCategory.detail(id)
            .then(category =>
                res.render('category/edit', { 
                    category: category[0] 
                })
            )
            .catch(err => {
                console.log("Có lỗi: ", err);
            })
    }

    //[PUT] /category/:id
    update(req, res){
        let category = req.body;
        let id = req.params.id;
        modelCategory.update(category, id);
        res.redirect('/admin/category')
    }

    //[DELETE] /category/:id
    delete(req, res){
        let id = req.params.id;
        let date = new Date();
        modelCategory.findFK(id, function(resultFK){
            if(resultFK.length == 0){
                modelCategory.delete(date, id);
                res.redirect('/admin/category');
            }
            else{
                const listCat = modelCategory.list();
                const countDeleted = modelCategory.countDeleted();
                Promise.all([listCat, countDeleted])
                    .then(([list, count_deleted]) => 
                        res.render('category/list',{
                            list,
                            count_deleted,
                            error: resultFK
                        }),
                    )
                    .catch(err => {
                        console.log("Có lỗi: ", err);
                    })
                // modelCategory.list(function(resultQuery){
                //     modelCategory.countDeleted(function(resultCount){
                //         let listCat = resultQuery;
                //         let countDeleted = resultCount;
                //         //res.json(countDeleted);
                //         res.render('category/list', { //list là chỉ file list.hbs trong thư mục category
                //             list: listCat,
                //             count_deleted: countDeleted,
                //             error: resultFK
                //         })
                //     });
                // });
            }
        })
    }

    //[PATCH] /category/:id/store
    restore(req, res){
        let id = req.params.id;
        let date = null;
        modelCategory.restore(date, id);
        res.redirect('/admin/category/trash');
    }
    
    //[DELETE] /category/:id/force
    forceDelete(req, res){
        let id = req.params.id;
        modelCategory.forceDelete(id);
        res.redirect('/admin/category/trash');
    }
}
module.exports = new CategoryController;