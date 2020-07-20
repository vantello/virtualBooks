'use strict'

//DEFINICIÓ DELS MODULS: REQUIREMENTS
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
//const morgan = ('morgan');
const method_override = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');

//BASE DE DADES
const { url } = require('./config/database');
mongoose.connect(url);

//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(method_override("_method"));
app.use(cookieParser());
app.use(session({
	secret: '77vb77vb',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const log = require('./public/js/main.js')



//Rutas
require('./config/passport')(passport);
require('./config/routes')(app, passport);
app.set("view engine","jade"); //jade, per esciure HTML
app.set('views', path.join(__dirname, 'views'));
app.use(express.static("public")); //Configurar CSS, JS, imatges - on buscar-ho
app.set('port', process.env.PORT || 8080 ); //port

app.get("/footer/about", function(req,res){
	res.render("footer/about");
});
app.get("/footer/privacy", function(req,res){
	res.render("footer/privacy");
});
app.get("/footer/help", function(req,res){
	res.render("footer/help");
});



//localhost
app.listen(app.get('port'),() => {
	console.log('Servidor corrent al port', app.get('port'));
});
