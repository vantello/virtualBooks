const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/user');

module.exports = function (passport){
  passport.serializeUser(function (user,done){
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
      User.findById(id, function (err, user) {
        done(err, user);
      });
    });
//register Facebook
passport.use(new FacebookStrategy({
  clientID: 'xxx',
  clientSecret: 'xxx',
  callbackURL: "http://localhost/8080/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done){
  User.findOrCreate({facebookId: profile.id},function(err,user){
    if(err)throw(err);
    done(null, user);
  });
}
));
//register twitter
passport.use(new TwitterStrategy({
  consumerKey: 'twitter api',
  consumerSecret: 'twitter api',
  callbackURL: "http://localhost/8080/auth/twitter/callback"
},
function(accessToken, refreshToken, profile, done){
  User.findOrCreate({twitterId: profile.id},function(err,user){
    if(err)throw(err);
    done(null, user);
  });
}
));
//register
passport.use('local-register', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback : true
},
function (req, email, password, done) {
  User.findOne({'email': email}, function (err, user) {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, false, req.flash('registerMessage', "L'email ja està en ús. Potser ja tens un usuari creat."));
    } else {
      var newUser = new User();
      newUser.name = req.body.name;
      newUser.lastname = req.body.lastname;
      newUser.username = req.body.username;
      newUser.email = email;
      newUser.password = newUser.generateHash(password);
      newUser.save(function (err) {
        if (err) { throw err; }
        var name = req.body.name;
        console.log(name);
        return done(null, newUser);
      });
    }
  });
}));
  // login
    passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, email, password, done) {
      User.findOne({'email': email}, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          console.log("L'usuari no existeix:" + email);
          return done(null, false, req.flash('loginMessage', "L'usuari no existeix."))
        }
        if (!user.validPassword(password)) {
          console.log("La contrasenya no concorda");
          return done(null, false, req.flash('loginMessage', 'Contrasenya incorrecte'));
        }
        return done(null, user);
      });
    }));
  }
