const modelProvider = require('../../models/admin/Provider');

class ProviderController{
    //[GET] /provider/
    index(req, res){
        const listProvider = modelProvider.list();
        const countDeleted = modelProvider.countDeleted();
        Promise.all([listProvider, countDeleted])
            .then(([list, count_deleted]) =>
                res.render('provider/list',{
                    list,
                    count_deleted,
                })
            )
            .catch(error => {
                console.log("Có lỗi hiển thị danh sách nhà cung cấp:" + error)
            })
    }

    //[GET] /provider/trash
    trash(req, res) {
        modelProvider.listTrash()
            .then(listTrash => 
                res.render('provider/trash', {
                    list: listTrash
                }),
            )
            .catch(err => {
                console.log("Có lỗi: " + err)
            })
    }

    //[GET] /provider/create
    create(req, res){
        res.render('provider/create');
    }

    //[POST] /provider/store
    store(req, res){
        let provider = req.body;
        let id = req.body.mancc;        
        modelProvider.findId(id ,function(resultId){
            if(resultId.length == 0){
                modelProvider.create(provider);
                res.redirect("/admin/provider");
            }
            else{
                res.render('provider/create', {
                    error: provider
                });
            }
        })
    }

    //[GET] /provider/edit/
    edit(req, res) {
        let id = req.params.id;
        modelProvider.findId(id, function(resultId){
            if(resultId.length == 0){
                res.redirect("/admin/provider");
            }
            else{
                modelProvider.detail(id)
                    .then(provider =>
                        res.render('provider/edit', { 
                            provider: provider[0] 
                        })
                    )
                    .catch(err => {
                        console.log("Có lỗi: ", err);
                    })
            }
        })
    }

    //[PUT] /provider/:id
    update(req, res){
        let provider = req.body;
        let id = req.body.mancc;
        modelProvider.update(provider, id);
        res.redirect('/admin/provider')
    }

    //[DELETE] /provider/:id
    delete(req, res){
        let id = req.params.id;
        let date = new Date();
        modelProvider.findFK(id, function(resultFK){
            if(resultFK.length == 0){
                modelProvider.delete(date, id);
                res.redirect('/admin/provider');
            }
            else{
                const listProvider = modelProvider.list();
                const countDeleted = modelProvider.countDeleted();
                Promise.all([listProvider, countDeleted])
                    .then(([list, count_deleted]) => 
                        res.render('provider/list',{
                            list,
                            count_deleted,
                            error: resultFK
                        }),
                    )
                    .catch(err => {
                        console.log("Có lỗi: ", err);
                    })
            }
        })
    }

    //[PATCH] /provider/:id/restore
    restore(req, res){
        let id = req.params.id;
        let date = null;
        modelProvider.restore(date, id);
        res.redirect('/admin/provider/trash');
    }
    
    //[DELETE] /provider/:id/force
    forceDelete(req, res){
        let id = req.params.id;
        modelProvider.forceDelete(id);
        res.redirect('/admin/provider/trash');
    }
}
module.exports = new ProviderController;