const modelProduct = require('../../models/customer/Product') 
const modelSites = require('../../models/customer/Sites')

class SitesController {

    // GET / (home)
    // index(req, res){
    //     modelProduct.list(function(listQuery){
    //         modelProduct.promotionList(function(proQuery){
    //             var list = listQuery;
    //             var proList = proQuery;
    //             res.render('home', {list, proList});
    //         })         
    //     })  
    // }

    index(req, res){
        const list = modelProduct.getProducts([0,8]);
        const proList = modelProduct.promotionList();
        Promise.all([list, proList])
            .then(([list, proList]) => {
                // console.log(proList);
                // res.json({list, proList});
                // proList.forEach(element => {
                //     modelProduct.getImages(element.masp, function)
                // });
                
                res.render('homeC',{
                    list,
                    proList
                })
            })
            .catch(err => {
                console.log("Co loi: ", err);
            })
    }

    search(req, res){
        if(req.query.keyword){
            req.session.keyword = req.query.keyword;
        }
        let k = req.session.keyword;  
        let page = req.query.page ? req.query.page : 1;
        let count = 4;
        let pages = [];
        modelSites.search(k, function(data){
            let totalProduct = data.length;
            let totalPage = Math.ceil(totalProduct / count);
            for(let i = 1; i <= totalPage; i++){
                pages.push(i);
            };

            if(page <= 0 || page > totalPage)
                page = 1; 
            
            let start = (page - 1)*count;
            modelSites.searchLimit(k, [start,count], function(data){
                res.render('search', {result: data, k, totalProduct, pages});
            })
        });
    }

    // // POST / may-anh / binh-luan / :id
    // postComment(req, res){
    //     let tentk = req.session.user.tentk;
    //     let noidung = req.body.comment;
    //     let masp = req.params.id;
    //     let cmt = {tentk, masp, noidung};
    //     modelSites.postComment(cmt);
    //     res.redirect('back');
    // }
    // // POST / may-anh / danh-gia
    // rating(req, res){
    //     req.session.redirectTo = req.body.currentPath;

    //         let sosao = req.body.sosao;
    //         let masp = req.body.masp;
    //         let tentk = req.session.user.tentk;
    //         let rate = {tentk, masp, sosao};
    //         const dataRate = modelSites.getRate(masp);

    //         dataRate.then((dataRate) => {
    //             //Kiểm tra user đã từng đánh giá sản phẩm này chưa?
    //             let flag = false;
    //             for(let item in dataRate){
    //                 if(dataRate[item].tentk === tentk){
    //                     flag = true; break;
    //                 }
    //             }
    //             modelSites.rating(rate, function(affectedRows){
    //                 if(affectedRows > 0){
    //                     modelSites.getRateFn(masp, function(resultQuery){
    //                         let tongsao = 0;
    //                         for(let i in resultQuery){
    //                             tongsao += resultQuery[i].sosao
    //                         }
    //                         let tbsao = Math.round((tongsao / resultQuery.length)*10) / 10;
    //                         res.json({luot: resultQuery.length, tbsao, login:true})
    //                     })
    //                 }
    //             }) 
    //             //Nếu chưa thì thêm đánh giá
    //             // if(!flag){
    //             //     modelSites.rating(rate, function(affectedRows){
    //             //         if(affectedRows > 0){
    //             //             modelProduct.getRateFn(masp, function(resultQuery){
    //             //                 let tongsao = 0;
    //             //                 for(let i in resultQuery){
    //             //                     tongsao += resultQuery[i].sosao
    //             //                 }
    //             //                 let tbsao = Math.round((tongsao / resultQuery.length)*10) / 10;
    //             //                 res.json({luot: resultQuery.length, tbsao, login:true})
    //             //             })
    //             //         }
    //             //     })                   
    //             // }
    //         }) 
    //         .catch(err => {
    //             console.log("Loi: ", err);
    //         })
    // }
    
}

module.exports = new SitesController;