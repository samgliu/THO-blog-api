var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const User = require('./models/user');
const cors = require('cors');

const session = require('express-session');
var compression = require('compression');
var helmet = require('helmet');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
require('dotenv').config();

var apiRouter = require('./routes/api');

var app = express();
//app.use(cors());

const corsConfig = {
    credentials: true,
    origin: [
        'http://localhost:3001',
        'http://localhost:3000',
        'https://samgliu.github.io',
    ],
};
app.use(cors(corsConfig));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(compression()); //Compress all routes
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression()); // Compress all routes
app.use(helmet());

// set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = ''; // personal mongodb url
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDb connection error:'));

app.use(
    session({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: true,
            sameSite: 'none',
            maxAge: 60 * 60 * 24 * 1000,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use('/', apiRouter);
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// auth
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

passport.use(
    new LocalStrategy((username, password, done) => {
        User.findOne({ Username: username }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }
            bcrypt.compare(password, user.Password, (err, res) => {
                if (res) {
                    // passwords match! log user in

                    return done(null, user);
                } else {
                    // passwords do not match!
                    return done(null, false, { message: 'Incorrect password' });
                }
            });
            //return done(null, user);
        });
    })
);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

module.exports = app;
