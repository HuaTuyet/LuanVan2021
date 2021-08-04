const express = require('express');
const methodOverride = require('method-override');
const handlebars = require('express-handlebars');
const path = require('path');
const app = express();
const address = process.env.port || 3000;
const route = require('./routes');
const session = require('express-session');


//Static file
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

console.log(path.join(__dirname, 'public'));

//Middleware
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

app.use(methodOverride('_method'));

//Template engine
app.engine('hbs', handlebars({
    extname: 'hbs',
    helpers: require('./helpers/handlebars'),
}));
app.set('view engine', 'hbs');
app.set('views', [path.join(__dirname, 'resources' ,'views','customer'),path.join(__dirname, 'resources' ,'views','admin')]); //__dirname sẽ là đường dẫn luanvan/src/ và ta thêm 2 cái kia vô
const hbs = require('handlebars')
hbs.registerHelper('formatCurrency', function(cur){
  return new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND'}).format(cur);
});


//Routes init
route(app);

// app.get('/', (req, res) => {
//     res.render('home');
// })

app.listen(address, () => {
    console.log(`App listening at http://localhost:${address}`);
});