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
        const list = modelProduct.list();
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
        modelSites.search1(k, function(data){
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
    
}

module.exports = new SitesController;