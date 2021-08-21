const modelProduct = require('../../models/customer/Product')

class ProductsController {
    // GET / may-anh
    show(req, res){
        let count = 4; // Số sản phẩm trên 1 trang             
        let page = req.query.page ? req.query.page : 1;
        const totalProduct = modelProduct.countAllProduct();
        const brands = modelProduct.getBrands();
        const types = modelProduct.getTypes();
        Promise.all([totalProduct, brands, types])
        .then(([totalProduct, brands, types]) => { 
            
            let pages = [];
            let totalPages = Math.ceil(totalProduct / count);
            for(let i = 1; i <= totalPages; i++){
                pages.push(i);
            };

            if(page <= 0 || page > totalPages)
                page = 1; 
            
            let start = (page - 1)*count;
            
            //Kiểm tra xem giá trị của biến sort trong session là gì?
            let sort = 0;
            if(req.session.sort){
                sort = req.session.sort;     
                switch(sort){
                    case "priceAsc":
                        const sortPriceAsc = modelProduct.sortPriceAsc([start,count]);
                        sortPriceAsc.then((list) => {
                            res.render('products/products', {list, pages, sort:1, brands, types});
                        })
                        .catch(err => {console.log("Loi: ", err);})
                        break;
                    case "priceDesc": 
                        const sortPriceDesc = modelProduct.sortPriceDesc([start,count]);
                        sortPriceDesc.then((list) => { 
                            res.render('products/products', {list, pages, sort:2, brands, types});
                        })  
                        .catch(err => {console.log("Loi: ", err);})
                        break;
                    case "lasted": 
                    const lastedList = modelProduct.getProducts([start,count]);
                    lastedList.then((list) => {
                        res.render('products/products', {list, pages, sort, brands, types});
                    })
                    .catch(err => {
                        console.log("Loi: ", err);
                    })
                }
            }
            else{
                const lastedList = modelProduct.getProducts([start, count]);
                lastedList.then((list) => {
                    //res.json({list, pages, sort, brands, start, count});
                    res.render('products/products', { list, pages, sort, brands, types });
                })
                .catch(err => { 
                    console.log("Loi: ", err);
                })
            }
        })
        .catch(err => { 
            console.log("Loi: ", err);
        })
    }

    // GET / may-anh / thuong-hieu
    showProductByBrand(req, res, next){
        let count = 4; // Số sản phẩm trên 1 trang  
        let math = req.query.math ? req.query.math : null;            
        let page = req.query.page ? req.query.page : 1;
        const totalProduct = modelProduct.countAllByBrand(math);
        const brands = modelProduct.getBrands();
        const types = modelProduct.getTypes();
        Promise.all([totalProduct, brands, types])
        .then(([totalProduct, brands, types]) => { 
            
            let pages = [];
            let totalPages = Math.ceil(totalProduct / count);
            for(let i = 1; i <= totalPages; i++){
                pages.push(i);
            };

            if(page <= 0 || page > totalPages)
                page = 1; 
            
            let start = (page - 1)*count;           
            let sort = 0;
            if(req.session.sort){
                sort = req.session.sort;     
                switch(sort){
                    case "priceAsc":
                        const sortPriceAsc = modelProduct.sortPriceAscByBrand([math,start,count]);
                        sortPriceAsc.then((list) => {
                            //res.json("sort asc brand");
                            res.render('products/products', {list, pages, sort:1, brands, types, math});
                        })
                        .catch(err => {console.log("Loi: ", err);})
                        break;
                    case "priceDesc": 
                        const sortPriceDesc = modelProduct.sortPriceDescByBrand([math,start,count]);
                        sortPriceDesc.then((list) => { 
                            //res.json("sort desc brand");
                            res.render('products/products', {list, pages, sort:2, brands, types, math});
                        })  
                        .catch(err => {console.log("Loi: ", err);})
                        break;
                    case "lasted": 
                    const lastedList = modelProduct.getProductsByBrand([math,start,count]);
                    lastedList.then((list) => {
                        res.render('products/products', {list, pages, sort, brands, types, math});
                    })
                    .catch(err => {
                        console.log("Loi: ", err);
                    })
                }
            }
            else{
                const lastedList = modelProduct.getProductsByBrand([math, start, count]);
                lastedList.then((list) => {
                    //res.json({list, pages, sort, brands, start, count});
                    res.render('products/products', {list, pages, sort, brands, types, math});
                })
                .catch(err => {
                    console.log("Loi: ", err);
                })
            }
        })
        .catch(err => { 
            console.log("Loi: ", err);
        })
    }

    // GET / may-anh / loai
    showProductByType(req, res, next){
        let count = 4; // Số sản phẩm trên 1 trang  
        let maloai = req.query.maloai ? req.query.maloai : null; console.log("loai: ", maloai);        
        let page = req.query.page ? req.query.page : 1;
        const totalProduct = modelProduct.countAllByType(maloai);
        const brands = modelProduct.getBrands();
        const types = modelProduct.getTypes();
        Promise.all([totalProduct, brands, types])
        .then(([totalProduct, brands, types]) => { 
            
            let pages = [];
            let totalPages = Math.ceil(totalProduct / count);
            for(let i = 1; i <= totalPages; i++){
                pages.push(i);
            };

            if(page <= 0 || page > totalPages)
                page = 1; 
            
            let start = (page - 1)*count;           
            let sort = 0;
            if(req.session.sort){
                sort = req.session.sort;     
                switch(sort){
                    case "priceAsc":
                        const sortPriceAsc = modelProduct.sortPriceAscByType([maloai,start,count]);
                        sortPriceAsc.then((list) => {
                            //res.json("sort asc brand");
                            res.render('products/products', {list, pages, sort:1, brands, types, maloai});
                        })
                        .catch(err => {console.log("Loi: ", err);})
                        break;
                    case "priceDesc": 
                        const sortPriceDesc = modelProduct.sortPriceDescByType([maloai,start,count]);
                        sortPriceDesc.then((list) => { 
                            res.render('products/products', {list, pages, sort:2, brands, types, maloai});
                        })  
                        .catch(err => {console.log("Loi: ", err);})
                        break;
                    case "lasted": 
                    const lastedList = modelProduct.getProductsByType([maloai,start,count]);
                    lastedList.then((list) => {
                        //console.log(list);
                        res.render('products/products', {list, pages, sort, brands, types, maloai});
                    })
                    .catch(err => {
                        console.log("Loi: ", err);
                    })
                }
            }
            else{
                const lastedList = modelProduct.getProductsByType([maloai, start, count]);
                lastedList.then((list) => {
                    //console.log("dssp loai: ", list);
                    res.render('products/products', {list, pages, sort, brands, types, maloai});
                })
                .catch(err => {
                    console.log("Loi: ", err);
                })
            }
        })
        .catch(err => { 
            console.log("Loi: ", err);
        })
    }
    
    // GET / may-anh / gia
    showProductByPrice(req, res){
        let count = 4; // Số sản phẩm trên 1 trang  
        let gia = req.query.value ? req.query.value : null; console.log("gia: ", gia);        
        let page = req.query.page ? req.query.page : 1;
        const totalProduct = modelProduct.countAllByPrice(gia);
        const brands = modelProduct.getBrands();
        const types = modelProduct.getTypes();
        //const price = modelProduct.getProductslByPrice(gia);
        Promise.all([totalProduct, brands, types])
        .then(([totalProduct, brands, types]) => { 
            
            let pages = [];
            let totalPages = Math.ceil(totalProduct / count);
            for(let i = 1; i <= totalPages; i++){
                pages.push(i);
            };

            if(page <= 0 || page > totalPages)
                page = 1; 
            
            let start = (page - 1)*count;           
            let sort = 0;
            if(req.session.sort){
                sort = req.session.sort;     
                switch(sort){
                    case "priceAsc":
                        const sortPriceAsc = modelProduct.sortPriceAscByPrice(gia,[start,count]);
                        sortPriceAsc.then((list) => {
                            //res.json("sort asc brand");
                            res.render('products/products', {list, pages, sort:1, brands, types, gia});
                        })
                        .catch(err => {console.log("Loi: ", err);})
                        break;
                    case "priceDesc": 
                        const sortPriceDesc = modelProduct.sortPriceDescByPrice(gia,[start,count]);
                        sortPriceDesc.then((list) => { 
                            res.render('products/products', {list, pages, sort:2, brands, types, gia});
                        })  
                        .catch(err => {console.log("Loi: ", err);})
                        break;
                    case "lasted": 
                    const lastedList = modelProduct.getProductsByPrice(gia, [start,count]);
                    lastedList.then((list) => {
                        //console.log(list);
                        res.render('products/products', {list, pages, sort, brands, types, gia});
                    })
                    .catch(err => {
                        console.log("Loi: ", err);
                    })
                }
            }
            else{
                const lastedList = modelProduct.getProductsByPrice(gia, [start, count]);
                lastedList.then((list) => {
                    //console.log("dssp loai: ", list);
                    res.render('products/products', {list, pages, sort, brands, types, gia});
                })
                .catch(err => {
                    console.log("Loi: ", err);
                })
            }
        })
        .catch(err => { 
            console.log("Loi: ", err);
        })
    }
    
    // POST / may-anh
    sort(req, res){
        if(req.body.sort){
            req.session.sort = req.body.sort;
        }
        
        let count = 4;
        let page = req.body.page;
        // if(page){
        //     if(page <= 0 || page > totalPages)
        //     page = 1; 
        // } else{
        //     page = 1;
        // } 
        let start = (page - 1)*count;
        if(req.session.sort){
            let sort = req.session.sort;     
            switch(sort){
                case "priceAsc":
                    const sortPriceAsc = modelProduct.sortPriceAsc([start,count]);
                    sortPriceAsc.then(priceList => {
                        console.log(priceList);
                        res.render('products/sort',{layout:false, priceList}, (err, html)=>{
                            res.send({html}); 
                        })  
                    })
                    .catch(err => {console.log("Loi: ", err);})
                    break;
                case "priceDesc":
                    const sortPriceDesc = modelProduct.sortPriceDesc([start,count]);
                    sortPriceDesc.then(priceList => {
                        res.render('products/sort',{layout:false, priceList}, (err, html)=>{
                            res.send({html});  
                        })
                    })
                    .catch(err => {console.log("Loi: ", err);})
                    break;
                case "lasted":
                    const sortLasted = modelProduct.getProducts([start,count]);
                    sortLasted.then(lastedList => {
                        res.render('products/sort',{layout:false, lastedList}, (err, html)=>{
                            res.send({html});  
                        })
                    })
                    .catch(err => {console.log("Loi: ", err);})
                    break;
            }
        }
    }

    // POST / may-anh / thuong-hieu
    sortByBrand(req, res){
        // Set session
        if(req.body.sort){
                req.session.sort = req.body.sort;
        }
            
        let count = 4;
        let page = req.body.page; 
        let math = req.body.math ? req.body.math : null;
        let start = (page - 1)*count;
        if(req.session.sort){
            let sort = req.session.sort;     
            switch(sort){
                case "priceAsc":
                    const sortPriceAsc = modelProduct.sortPriceAscByBrand([math,start,count]);
                    sortPriceAsc.then(priceList => {
                        res.render('products/sort',{layout:false, priceList}, (err, html)=>{
                            res.send({html}); 
                        })  
                    })
                    .catch(err => {console.log("Loi: ", err);})
                    break;
                case "priceDesc":
                    const sortPriceDesc = modelProduct.sortPriceDescByBrand([math,start,count]);
                    sortPriceDesc.then(priceList => {
                        res.render('products/sort',{layout:false, priceList}, (err, html)=>{
                            res.send({html});  
                        })
                    })
                    .catch(err => {console.log("Loi: ", err);})
                    break;
                case "lasted":
                    const sortLasted = modelProduct.getProductsByBrand([math,start,count]);
                    sortLasted.then(lastedList => {
                        res.render('products/sort',{layout:false, lastedList}, (err, html)=>{
                            res.send({html});  
                        })
                    })
                    .catch(err => {console.log("Loi: ", err);})
                    break;
            }
        }
    }

    // POST / may-anh / loai
    sortByType(req, res){
        if(req.body.sort){
                req.session.sort = req.body.sort;
        }
            
        let count = 4; 
        let page = req.body.page; 
        let maloai = req.body.maloai ? req.body.maloai : null;
        let start = (page - 1)*count;
        if(req.session.sort){
            let sort = req.session.sort;     
            switch(sort){
                case "priceAsc":
                    const sortPriceAsc = modelProduct.sortPriceAscByType([maloai,start,count]);
                    sortPriceAsc.then(priceList => {
                        res.render('products/sort',{layout:false, priceList}, (err, html)=>{
                            res.send({html}); 
                        })  
                    })
                    .catch(err => {console.log("Loi: ", err);})
                    break;
                case "priceDesc":
                    const sortPriceDesc = modelProduct.sortPriceDescByType([maloai,start,count]);
                    sortPriceDesc.then(priceList => {
                        res.render('products/sort',{layout:false, priceList}, (err, html)=>{
                            res.send({html});  
                        })
                    })
                    .catch(err => {console.log("Loi: ", err);})
                    break;
                case "lasted":
                    const sortLasted = modelProduct.getProductsByType([maloai,start,count]);
                    sortLasted.then(lastedList => {
                        res.render('products/sort',{layout:false, lastedList}, (err, html)=>{
                            res.send({html});  
                        })
                    })
                    .catch(err => {console.log("Loi: ", err);})
                    break;
            }
        }
    }

    // POST / may-anh / gia
    sortByPrice(req, res){
        if(req.body.sort){
                req.session.sort = req.body.sort;
        }
            
        let count = 4; 
        let page = req.body.page; 
        let gia = req.body.gia ? req.body.gia : null;
        let start = (page - 1)*count;
        if(req.session.sort){
            let sort = req.session.sort;     
            switch(sort){
                case "priceAsc":
                    const sortPriceAsc = modelProduct.sortPriceAscByPrice(gia, [start,count]);
                    sortPriceAsc.then(priceList => {
                        res.render('products/sort',{layout:false, priceList}, (err, html)=>{
                            res.send({html}); 
                        })  
                    })
                    .catch(err => {console.log("Loi: ", err);})
                    break;
                case "priceDesc":
                    const sortPriceDesc = modelProduct.sortPriceDescByPrice(gia, [start,count]);
                    sortPriceDesc.then(priceList => {
                        res.render('products/sort',{layout:false, priceList}, (err, html)=>{
                            res.send({html});  
                        })
                    })
                    .catch(err => {console.log("Loi: ", err);})
                    break;
                case "lasted":
                    const sortLasted = modelProduct.getProductsByPrice(gia, [start,count]);
                    sortLasted.then(lastedList => {
                        res.render('products/sort',{layout:false, lastedList}, (err, html)=>{
                            res.send({html});  
                        })
                    })
                    .catch(err => {console.log("Loi: ", err);})
                    break;
            }
        }
    }

    // GET / may-anh / :id === DETAIL PAGE
    detail(req, res){ 
        let masp = req.params.id;
        modelProduct.getAProduct(masp,function(data){
            if(data){
                const sp = modelProduct.detail(masp);
                const ts = modelProduct.thongso(masp);
                const th = modelProduct.brandOfProduct(masp);
                const ha = modelProduct.imgOfProduct(masp);
                const bl = modelProduct.getComment(masp);
                const dg = modelProduct.getRate(masp);
                Promise.all([sp, ts, th, ha, bl, dg])
                    .then(([sanpham, thongso, thuonghieu, hinh, binhluan, dg]) => {
                        let tongsao = 0;
                        let tbsao = 0;
                        for(let i in dg){
                            tongsao += dg[i].sosao
                        }
                        if(tongsao > 0){
                            tbsao = Math.round((tongsao / dg.length)*10) / 10;
                        }
                        res.render('products/detail', 
                            {sanpham,thongso,thuonghieu,hinh,binhluan,tbsao, luot: dg.length});
                    })
                    .catch(err => {
                        console.log("Loi: ", err);
                    })
            } else {
                res.redirect('/');
            }
        })  
    }

    // POST / may-anh / binh-luan / :id
    postComment(req, res){
        let tentk = req.session.user.tentk;
        let noidung = req.body.comment;
        let masp = req.params.id;
        let cmt = {tentk, masp, noidung};
        modelProduct.postComment(cmt);
        res.redirect('back');
    }
    // POST / may-anh / danh-gia
    rating(req, res){
        req.session.redirectTo = req.body.currentPath;
            let sosao = req.body.sosao;
            let masp = req.body.masp;
            let tentk = req.session.user.tentk;
            let rate = {tentk, masp, sosao};
            //const dataRate = modelProduct.getRate(masp);

            modelProduct.checkBoughtProduct(tentk, masp, function(result){
                if(result.length > 0){
                    modelProduct.rating(rate, function(affectedRows){
                        if(affectedRows > 0){
                            modelProduct.getRateFn(masp, function(resultQuery){
                                let tongsao = 0;
                                for(let i in resultQuery){
                                    tongsao += resultQuery[i].sosao
                                }
                                let tbsao = Math.round((tongsao / resultQuery.length)*10) / 10;
                                res.json({luot: resultQuery.length, tbsao, login:true})
                            })
                        }
                    }) 
                } else {
                    res.json({login:true, error: true}); console.log('ko danh gia dc')
                }
            })

            // dataRate.then((dataRate) => {
                //Kiểm tra user đã từng đánh giá sản phẩm này chưa?
                // let flag = false;
                // for(let item in dataRate){
                //     if(dataRate[item].tentk === tentk){
                //         flag = true; break;
                //     }
                // }
                //Nếu chưa thì thêm đánh giá
                // if(!flag){
                //     modelProduct.rating(rate, function(affectedRows){
                //         if(affectedRows > 0){
                //             modelProduct.getRateFn(masp, function(resultQuery){
                //                 let tongsao = 0;
                //                 for(let i in resultQuery){
                //                     tongsao += resultQuery[i].sosao
                //                 }
                //                 let tbsao = Math.round((tongsao / resultQuery.length)*10) / 10;
                //                 res.json({luot: resultQuery.length, tbsao, login:true})
                //             })
                //         }
                //     })                   
                // }
            // }) 
            // .catch(err => {
            //     console.log("Loi: ", err);
            // })
    }
}

module.exports = new ProductsController;