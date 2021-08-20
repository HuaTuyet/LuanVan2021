const modelCoupon = require('../../models/admin/Coupon');

class CouponController{
    //[GET] /coupon
    index(req, res){
        const listCoupon = modelCoupon.list();
        const countDeleted = modelCoupon.countDeleted();
        Promise.all([listCoupon, countDeleted])
            .then(([list, count_deleted]) => 
                res.render('coupon/list',{
                    list,
                    count_deleted
                }),
            )
            .catch(err => {
                console.log("Có lỗi: ", err);
            })
    }

    //[GET] /coupon/trash
    trash(req, res){
        modelCoupon.listTrash()
            .then(list => 
                res.render('coupon/trash', {
                    list
                })
            )
            .catch(err =>{
                console.log("Có lỗi: " + err);
            })
    }

    //[GET] /coupon/create
    create(req, res){
        res.render('coupon/create');
    }

    //[POST] /coupon/store
    store(req, res){
        let coupon = req.body;
        let id = req.body.magg;
        let date = new Date();
        let ngayapdung = req.body.ngayapdung;
        let ngayketthuc = req.body.ngayketthuc;
        //res.json(Date.parse(ngayapdung) > date);
        //res.json(ngayapdung == ngayketthuc)
        if(Date.parse(ngayapdung) < date || ngayapdung > ngayketthuc){
            res.render('coupon/create',{
                error:coupon,
                errdate: "Ngày áp dụng phải lớn hơn ngày hôm nay hoặc ngày kết thúc phải lớn hơn ngày áp dụng"
            })
        }
        else{
            modelCoupon.findId(id, function(resultId){
                if(resultId.length == 0){
                    modelCoupon.create(coupon);
                    res.redirect('/admin/coupon');
                }
                else{
                    res.render('coupon/create', {
                        error: coupon,
                        errid: "Trùng mã giảm giá"
                    });
                }
            })
        }
    }

    //[GET] /coupon/:id/edit
    edit(req, res) {
        let id = req.params.id;
        modelCoupon.findId(id, function(resultId){
            if(resultId.length == 0){
                res.redirect('/admin/coupon');
            }
            else{
                modelCoupon.detail(id)
                    .then(coupon =>
                        res.render('coupon/edit', { 
                            coupon: coupon[0]
                        })
                    )
                    .catch(err => {
                        console.log("Có lỗi: ", err);
                    })
            }
        })
    }

    //[PUT] /coupon/:id
    update(req, res){
        let coupon = req.body;
        let id = req.params.id;
        let date = new Date();
        let ngayapdung = req.body.ngayapdung;
        let ngayketthuc = req.body.ngayketthuc;
        if(Date.parse(ngayapdung) < date || ngayapdung > ngayketthuc){
            res.render('coupon/edit',{
                error: coupon,
                errdate: "Ngày áp dụng phải lớn hơn ngày hôm nay hoặc ngày kết thúc phải lớn hơn ngày áp dụng"
            })
        }
        else{
            modelCoupon.update(coupon, id);
            res.redirect('/admin/coupon');
        }
    }

    //[DELETE] /coupon/:id
    delete(req, res) {
        let id = req.params.id;
        let date = new Date();
        modelCoupon.findFK(id, function(resultFK) {
            if(resultFK.length == 0){
                modelCoupon.delete(date, id);
                res.redirect('/admin/coupon');
            }
            else{
                const listCoupon = modelCoupon.list();
                const countDeleted = modelCoupon.countDeleted();
                Promise.all([listCoupon, countDeleted])
                    .then(([list, count_deleted]) => 
                        res.render('coupon/list',{
                            list,
                            count_deleted,
                            error:"Không thể xóa vì đang tồn tại sản phẩm thuộc mã giảm giá này"
                        }),
                    )
                    .catch(err => {
                        console.log("Có lỗi: ", err);
                    })
            }
        })
    }

    //[PATCH] /coupon/:id/restore
    restore(req, res) {
        let id = req.params.id;
        let date = null;
        modelCoupon.restore(date, id);
        res.redirect('/admin/coupon/trash');
    }

    // [DELETE] /coupon/:id/force
    forceDelete(req, res) {
        let id = req.params.id;
        modelCoupon.forceDelete(id);
        res.redirect('/admin/coupon/trash');
    }
}

module.exports = new CouponController;