const modelReportSales = require('../../models/admin/ReportSales');

class ReportSalesController{

    index(req, res) {
        res.render('reportsales');
    }

    calculate(req, res) {
        let month = req.body.month;
        let year = req.body.year;
        const list = modelReportSales.list(month, year);
        const total = modelReportSales.total(month, year);
        Promise.all([list, total])
            .then(([list, total]) => {
                res.render('reportsales', {
                    list,
                    total: total[0],
                    test1: month,
                    test2: year,
                    layout: false,
                }, (err, html)=> {
                    res.send({html});
                })
                
            })
            .catch((err) => {
                console.log("Có lỗi:" + err);
            })
        //res.json(req.body);
    }

}

module.exports = new ReportSalesController;