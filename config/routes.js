var Book = require('../models/book');


module.exports = (app, passport) => {

	app.get("/", (req,res) => {
		res.render("index") // busca un arxiu amb extensió jade, i el renderitza
	});

	app.get('/auth/facebook', passport.authenticate('facebook'));

	app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/register' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('profile');
  });

	app.get('/auth/twitter', passport.authenticate('facebook'));

	app.get('/auth/twitter/callback',
	passport.authenticate('twitter', { failureRedirect: '/register' }),
	function(req, res) {
		// Successful authentication, redirect home.
		res.redirect('profile');
	});

	app.get('/login', (req,res) => {
		res.render('login', {
			message: req.flash('loginMessage')
		});
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: 'profile',
		failureRedirect: 'login',
		failureFlash: true
	}));

	app.get("/register", (req,res) => {

		res.render("register", {
			message: req.flash('registerMessage')
		});
	});

	app.post('/register', passport.authenticate('local-register', {
		successRedirect: 'profile',
		failureRedirect: 'register',
		failureFlash: true
	}));

	app.get('/profile', isLoggedIn, (req,res) => {
	  Book.find(({usuari: req.user.username}),function(err,doc){
	    if(err){console.log(err);}
	    res.render('profile',{
	      name: req.user.name,
	      totalbooks: doc.length
	    });
	  });
	});

	app.get('/books/new', isLoggedIn, (req,res) => {
		res.render('books/new', {
			name: req.user.name,
			email: req.user.email
		});
	});
	app.get('/books/search', isLoggedIn, (req,res) => {
		res.render('books/search', {
			name: req.user.name,
			email: req.user.email
		});
	});
	app.get('/profile', isLoggedIn, (req,res) => {
		res.render('profile', {
			name: req.user.name,
			email: req.user.email
		});
	});

	//operativa per a mostrar entrades --> find per buscar all, findOne per buscar un.
	app.get("/books", isLoggedIn, function(req,res){
			Book.find(({usuari: req.user.username}),function(error,documento){
			if(error){console.log(error);}
				res.render("books",{
					books: documento,
					name: req.user.name,
					email: req.user.email
				})
			});

	});
	app.get("/books/library", isLoggedIn, function(req,res){
			Book.find(({usuari: req.user.username}),function(error,documento){
			if(error){console.log(error);}
				res.render("books/library",{
					books: documento,
					name: req.user.name,
					email: req.user.email
				})
			});

	});
	// Mostrar fitxa dels LLIBRES
	app.get("/books/fitxa/:id", isLoggedIn, function(req,res){
		var id_book = req.params.id;
		//buscar un llibre en concret findOne
		Book.findOne({_id: id_book},function(error,book){
			console.log(book);
			res.render("books/fitxa",{
				book: book,
				name: req.user.name
			});
		});
	});

	//Definir ruta a través de la que es creen els productes
	app.post("/books",isLoggedIn, function(req,res){
		console.log(req.bodyParser);
		var data = {
		title: req.body.title,
		author: req.body.author,
		editorial: req.body.editorial,
		read: req.body.read,
		pages: req.body.pages,
		category: req.body.category,
		deixat: req.body.deixat,
		who: req.body.who,
		comments: req.body.comments,
		usuari: req.user.username
		}
			if(!req.body.title && !req.body.author && !req.body.editorial && !req.body.read && !req.body.pages && !req.body.category && !req.body.deixat && !req.body.who && !req.body.comments){
				req.flash('Message', 'Sense dades no pots crear un llibre');
				res.render("books/new", {
					message: req.flash('Message'),
					name: req.user.name
				});
			}else{
				if(req.body.deixat = 'NO'){
					var data = {
					title: req.body.title,
					author: req.body.author,
					editorial: req.body.editorial,
					read: req.body.read,
					pages: req.body.pages,
					category: req.body.category,
					deixat: req.body.deixat,
					who: 'No deixat',
					comments: req.body.comments,
					usuari: req.user.username
					}

					console.log("Aquest llibre no l'he deixat");
				}
				var book = new Book(data);
				book.save(function(err){

				console.log(book);
				res.redirect("/books");
			});	}
	});

	//Ordenar
	app.get("/sbyauthor", isLoggedIn, function(req,res){
		Book.find(({usuari: req.user.username}),function(error,documento){
			if(error){console.log(error);}
				res.render("books/library",{
					books: documento,
					name: req.user.name,
					email: req.user.email
				})
		}).sort({author:1});
	});
	app.get("/sbytitle", isLoggedIn, function(req,res){
		Book.find(({usuari: req.user.username}),function(error,documento){
			if(error){console.log(error);}
				res.render("books/library",{
					books: documento,
					name: req.user.name,
					email: req.user.email
				})
		}).sort({title:1});
	});
	app.get("/sbyeditorial", isLoggedIn, function(req,res){
		Book.find(({usuari: req.user.username}),function(error,documento){
			if(error){console.log(error);}
				res.render("books/library",{
					books: documento,
					name: req.user.name,
					email: req.user.email
				})
		}).sort({editorial:1});
	});
	app.get("/sbyread", isLoggedIn, function(req,res){
		Book.find(({usuari: req.user.username}),function(error,documento){
			if(error){console.log(error);}
				res.render("books/library",{
					books: documento,
					name: req.user.name,
					email: req.user.email
				})
		}).sort({read:1});
	});
	app.get("/sbypages", isLoggedIn, function(req,res){
		Book.find(({usuari: req.user.username}),function(error,documento){
			if(error){console.log(error);}
				res.render("books/library",{
					books: documento,
					name: req.user.name,
					email: req.user.email
				})
		}).sort({pages:1});
	});
	app.get("/sbycategory", isLoggedIn, function(req,res){
		Book.find(({usuari: req.user.username}),function(error,documento){
			if(error){console.log(error);}
				res.render("books/library",{
					books: documento,
					name: req.user.name,
					email: req.user.email
				})
		}).sort({category:1});
	});
	app.get("/sbydeixats", isLoggedIn, function(req,res){
		Book.find(({usuari: req.user.username}),function(error,documento){
			console.log(documento);
			if(error){console.log(error);}
				res.render("books/library",{
					books: documento,
					name: req.user.name,
					email: req.user.email
				})
		}).sort({deixat:1});
	});

	//buscador
	app.post("/search", isLoggedIn, function(req,res){
		var editorial = req.body.editorial;
		var title = req.body.title;
		var author = req.body.author;
		var read = req.body.read;
		var deixat = req.body.deixat;
		var who = req.body.who;
		var pages = req.body.pages;
		var category = req.body.category;
		var maxpages = req.body.maxpages;
		if(editorial == "" && title == "" && author == "" && read == "" && category == "" && pages == "" && deixat == "" && who == "" && maxpages == ""){
			req.flash('searchMessage', 'No has introduït res a buscar');
			res.render("books/search", {
				message: req.flash('searchMessage'),
				name: req.user.name
			});
		}else{
				Book.find({
					$and:[
						{ usuari: req.user.username },
						{ $or: [{'editorial': editorial},{'title': title},{'author': author},{'read': read},{'category': category},{'pages': pages},{'deixat': deixat},{'who': who},{ 'pages': {$lte: maxpages} } ]},					]
				},function(error,documento){
					if(error){console.log(error);}
					console.log(maxpages);
					if(documento.length == 0){
						console.log('No hi ha coincidencies amb les recerques que has introduït');
						req.flash('noMessage','No hi ha conicidencies amb les recerques que has introduït');
						res.render("books/search", {
							books: documento,
							name: req.user.name,
							message:req.flash('noMessage')

						 });
					}else{
						res.render("books/library", {
							books: documento,
							name: req.user.name
						})
					}
					});

		};
	});

	// EDITAR LLIBRES
	app.put("/books/:id", isLoggedIn, function(req,res){
		var id = req.params.id;
		if(req.body.confirm == confirm){
			var data = {
				title: req.body.title,
				author: req.body.author,
				editorial: req.body.editorial,
				read: req.body.read,
				deixat: req.body.deixat,
				who: req.body.who,
				pages: req.body.pages,
				category: req.body.category,
				comments: req.body.comments
			};
			Book.update({"_id": id},data,function(book){
				res.redirect("/books");
			})
		}else{
			res.redirect("/books");
		}
	});

	app.get("/books/edit/:id", isLoggedIn, function(req,res){
		var id_book = req.params.id;
		//buscar un llibre en concret findOne
		Book.findOne({_id: id_book},function(error,book){
			console.log(book);
			res.render("books/edit",{
				book: book,
				name: req.user.name
			});
		});
	});


	//BORRAR LLIBRES
	const confirm = "SI VULL";

	app.get("/books/delete/:id", isLoggedIn, function(req,res){
		var id_book = req.params.id;

		Book.findOne({_id: id_book},function(error,book){
			console.log(book);
			res.render("books/delete",{
				book: book,
				name: req.user.name
			});
		});
	});

	app.delete("/books/:id", isLoggedIn, function(req,res){
		var id_book = req.params.id;
		if(req.body.confirm == confirm){
			Book.remove({_id: id_book},function(err){
				if(err){console.log(err);}
				res.redirect("/books");
			});
		}else{
			res.redirect("/books");
		}
	});

	app.get('/logout', (req,res) => {
		req.logout();
		res.redirect('/');
	});
};
function read(){
	Book.find({'read': 'si'}, function(req,res){
		if(err){console.los(err);}

		return res;
	})
}
function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
};
