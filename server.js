var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('./config');
var app = express();
var googleProfile = {};



//serializacja
passport.serializeUser(function (user, done) {
	done(null, user);
});
passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

//autoryzacja
passport.use(new GoogleStrategy({
		clientID: config.GOOGLE_CLIENT_ID,
		clientSecret: config.GOOGLE_CLIENT_SECRET,
		callbackURL: config.CALLBACK_URL
	},
	function (accessToken, refreshToken, profile, cb) {
		googleProfile = {
			id: profile.id,
			displayName: profile.displayName
		};
		cb(null, profile);
	}
));

//silnik widoków i inicjalizacja passport 
app.set('view engine', 'pug');
app.set('views', './views');
app.use(passport.initialize());
app.use(passport.session());


//app routes
app.get('/', function(req, res){
    res.render('index', { 
		url: '/auth/google', 
		user: req.user });
});

app.get('/logged', function(req, res){
    res.render('logged', { user: googleProfile });
});

//Passport routes
app.get('/auth/google',
passport.authenticate('google', {
scope : ['profile', 'email']
}));
app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect : '/logged',
        failureRedirect: '/'
    }));

app.listen(3000);