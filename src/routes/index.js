const categoryRouter = require('./admin/category');
const brandRouter = require('./admin/brand');
const couponRouter = require('./admin/coupon');
const productRouter = require('./admin/product');
const orderRouter = require('./admin/order');
const goodsimportslipRouter = require('./admin/goodsimportslip');
const reportsalesRouter = require('./admin/reportsales');
const providerRouter = require('./admin/provider');
const siteRouter = require('./admin/site');
const authRouter = require('./admin/auth');

/*================== CUSTOMER ==================== */
const sitesRouterC = require('./customer/sites')
const productsRouterC = require('./customer/products')

function routes(app) {
    app.use('/admin/auth', authRouter);
    app.use('/admin/brand', brandRouter);
    app.use('/admin/category', categoryRouter);
    app.use('/admin/coupon', couponRouter);
    app.use('/admin/product', productRouter);
    app.use('/admin/order', orderRouter);
    app.use('/admin/goodsimportslip', goodsimportslipRouter);
    app.use('/admin/reportsales', reportsalesRouter);
    app.use('/admin/provider', providerRouter);
    app.use('/admin', siteRouter);

    /*================== CUSTOMER ==================== */
    app.use('/may-anh', productsRouterC)
    app.use('/', sitesRouterC)      
}

module.exports = routes;
