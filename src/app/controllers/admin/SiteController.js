class SiteController{
    index(req, res){
        res.render('home');//home này là file home.hbs
    }

    //[GET] /news
    show(req, res){
        res.render('news');
    }
}

module.exports = new SiteController;