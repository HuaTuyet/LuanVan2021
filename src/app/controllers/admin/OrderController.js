const modelOrder = require('../../models/admin/Order');
var fs = require('fs');
const path = require('path');
const pdf = require('pdf-creator-node');
const options = require('../../../helpers/optionInvoice');
const nodemailer = require('nodemailer');
let dirPath = path.join(`${__dirname}/../../public/dist/img/`)

class OrderController {
    //[GET] /order/
    index(req, res) {
            const listOrder = modelOrder.list()
            .then(list =>
                res.render('order/list', {
                    list
                })
            )
            .catch(err =>{
                console.log("Có lỗi: " + err);
            })
    }

    //[POST] /order/
    sort(req, res){
        console.log(req.body.sort);
        if(req.body.sort){
            req.session.sort = req.body.sort;
        }
        if(req.session.sort){
            let sort = req.session.sort;
            switch(sort){
                case 'today':
                    const sortToday = modelOrder.sortToday()
                        sortToday.then(list =>
                            res.render('order/list', {
                                list,
                                sort: "today",
                                layout: false,
                            }, (err, html)=> {
                                res.send({html});
                            })
                        )
                        .catch(err =>{
                            console.log("Có lỗi: " + err);
                        })
                    break;
                case 'yesterday':
                    const sortYesterday = modelOrder.sortYesterday()
                        sortYesterday.then(list =>
                            res.render('order/list', {
                                list,
                                sort: "yesterday",
                                layout: false,
                            }, (err, html)=> {
                                res.send({html});
                            })
                        )
                        .catch(err =>{
                            console.log("Có lỗi: " + err);
                        })
                    break;
                case 'lastweek':
                    const sortLastWeek = modelOrder.sortLastWeek()
                        sortLastWeek.then(list =>
                            res.render('order/list', {
                                list,
                                sort: "lastweek",
                                layout: false,
                            }, (err, html)=> {
                                res.send({html});
                            })
                        )
                        .catch(err =>{
                            console.log("Có lỗi: " + err);
                        })
                    break;
                case 'lastmonth':
                    const sortLastMonth = modelOrder.sortLastMonth()
                        sortLastMonth.then(list =>
                            res.render('order/list', {
                                list,
                                sort: "lastmonth",
                                layout: false,
                            }, (err, html)=> {
                                res.send({html});
                            })
                        )
                        .catch(err =>{
                            console.log("Có lỗi: " + err);
                        })
                    break;
                case 'all':
                    const sortAll = modelOrder.list();
                        sortAll.then(list =>
                            res.render('order/list', {
                                list,
                                sort: "all",
                                layout: false,
                            }, (err, html)=> {
                                res.send({html});
                            })
                        )
                        .catch(err =>{
                            console.log("Có lỗi: " + err);
                        })
                    break;
            }

        }
    }

    //[GET] /order/:id/detail
    detail(req, res) {
        let id = req.params.id;
        modelOrder.findId(id, function(resultId){
            if(resultId.length == 0){
                res.redirect("/admin/order");
            }
            else{
                const detaiOrder = modelOrder.detail(id);
                const orderProduct = modelOrder.product(id);
                Promise.all([detaiOrder, orderProduct])
                    .then(([detail, product]) =>{
                        res.render('order/detail', {
                            detail,
                            product
                        })
                    })
                    .catch(err =>{
                        console.log("Có lỗi: " + err);
                    })
            }
        })
    }

    //[PATCH] /order/:id/changestatus
    async changestatus(req, res){
        let id = req.params.id;
        const orderProduct = modelOrder.product(id);
        let status = req.body.trangthai;
        if(status != null){
            modelOrder.changeStatus(status, id);
        }
        else{
            if(req.body.accept != null){
                modelOrder.changeStatus(1, id);
                const order = modelOrder.getOrder(id);
                const detail = modelOrder.getDetailOrder(id);
                Promise.all([order, detail])
                    .then(([order, detail]) =>{
                        const html = fs.readFileSync(path.join(`${__dirname}/../../../resources/views/template.html`), 'utf8');
                        const filename = id + '_doc' + '.pdf';
                        let array = [];
                        detail.forEach(d => {
                            const prod = {
                                tensp: d.tensp,
                                soluong: d.soluong,
                                dongia: d.dongia,
                                tong: d.soluong * d.dongia,
                            }
                            array.push(prod);
                        });
                        let subtotal = 0;
                        array.forEach(i => {
                            subtotal += i.tong
                        });
                        const phivc = order[0].phivc;
                        const giamgia = order[0].giamgia;
                        const thanhtien = subtotal + phivc - giamgia;
                        const obj = {
                            madh: order[0].madh,
                            ngaydat: order[0].ngaydat,
                            tenkh: order[0].tenkh,
                            diachi: order[0].diachi,
                            prodlist: array,
                            subtotal: subtotal,
                            phivc: phivc,
                            giamgia: giamgia,
                            thanhtien: thanhtien
                        };
                        const document = {
                            html: html,
                            data: {
                                products: obj
                            },
                            path: './src/invoices/' + filename
                        }
                        pdf.create(document, options)
                            .then(res => {
                                console.log(res);
                            }).catch(error => {
                                console.log(error);
                            });
                        //res.json(thanhtien);
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth:{
                                user: "elsword8585@gmail.com",
                                pass: "xtcefahrjodtlrxv",
                            }
                        });
                        transporter.sendMail({
                            from: "elsword8585@gmail.com",
                            to: order[0].email,
                            subject: "Hóa đơn điện tử",
                            text: "Cảm ơn bạn đã mua hàng của cửa hàng chúng tôi!! Đơn hàng của bạn đang được chuẩn bị. Chúng tôi sẽ giao hàng cho bạn trong thời gian sớm nhất.",
                            attachments: [
                                {filename: id + '_doc' + '.pdf', path: './src/invoices/'+ filename}
                            ]
                        }, function (err, info) {
                            if(err) {
                                console.log("Có lỗi trong gửi mail: "+ err);
                            }
                            else {
                                console.log("Đã gửi mail")
                            }
                        })
                    })
                    .catch(err =>{
                        console.log("Có lỗi tạo hóa đơn:" + err)
                    })
            }
            else{
                modelOrder.changeStatus(4, id);
                Promise.all([orderProduct])
                    .then(([product]) =>{
                        // res.json(product[1].soluong);
                        for(let i = 0; i < product.length; i++){
                            modelOrder.increaseProductQuantity(product[i].soluong, product[i].masp)
                        }
                    })
                    .catch(err =>{
                        console.log("Có lỗi cập nhật số lượng sản phẩm: " + err);
                    })
            }
        }
        //modelOrder.changeStatus(status, id);
        //res.json(req.body);
        res.redirect('/admin/order');
    }

    // receipt(req, res) {
    //     let id = req.params.id;
    //     const order = modelOrder.getOrder(id);
    //     const detail = modelOrder.getDetailOrder(id);
    //     Promise.all([order, detail])
    //         .then(([order, detail]) => {
    //             //res.json(order);
    //             var product = [];
    //             for (var i = 0; i < detail.length; i++) {
    //                 product.push(detail[i]);
    //             } 
    //             //res.json(product);
    //             var data = {
    //                 "documentTitle": "HÓA ĐƠN",
    //                 "currency": "VND", //See documentation 'Locales and Currency' for more info
    //                 "taxNotation": "vat", //or gst
    //                 "marginTop": 25,
    //                 "marginRight": 25,
    //                 "marginLeft": 25,
    //                 "marginBottom": 25,
    //                 "logo": fs.readFileSync(dirPath + "logo.jpg", 'base64'),
    //                 "sender": {
    //                     "company": "Cửa hàng máy ảnh",
    //                     "address": "84 Cao Lỗ, phường 4, quận 8",
    //                     "zip": "700000",
    //                     "city": "Hồ Chí Minh",
    //                     "country": "Việt Nam",
    //                 },
    //                 "client": {
    //                     "company": order[0].tenkh,
    //                     "address": order[0].diachi,
    //                     "zip": "700000",
    //                     "city": "Hồ Chí Minh",
    //                     "country": "Việt Nam",
    //                 },
    //                 "invoiceNumber": order[0].madh,
    //                 "invoiceDate": order[0].ngaydat,
    //                 "products":[] = product,
    //                 "translate": {
    //                     "invoiceNumber": "Số hóa đơn",
    //                     "invoiceDate": "Ngày đặt hàng",
    //                     "products": "Sản phẩm", 
    //                     "quantity": "Số lượng", 
    //                     "price": "Giá",
    //                     "subtotal": "Tạm tính",
    //                     "total": "Thành tiền" 
    //                 }
    //             }
    //             res.send(data);
    //         })
    // }
}

module.exports = new OrderController;