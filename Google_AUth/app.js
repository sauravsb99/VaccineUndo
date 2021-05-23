const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const passport = require('passport')
const session = require('express-session')
const expressLayouts = require('express-ejs-layouts')
const MongoStore = require('connect-mongo')(session)
const User = require('./models/User')

var app = express();
const PORT = process.env.PORT || 3000;
dotenv.config({ path: './config/config.env' })

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// Passport config
require('./config/passport')(passport)


app.use('/public', express.static('public'));
app.use(expressLayouts);
// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
    // app.use(express.static('public'))

app.set('view engine', 'ejs');

app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())


app.use(require("./routes/index"))
app.use('/auth', require('./routes/auth'))





app.listen(PORT, console.log(`listening at ${PORT}`))

app.post('/submit', (req, res) => {
    console.log(req.body);
    mongoose.connect('mongodb+srv://vaccineundo:vaccineundo.com@cluster0.uo2id.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').then(
        () => {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = dd + '-' + mm + '-' + yyyy;
            User
                .findOne({ email: req.body.mail, age: "code" })
                .then(doc => {
                    doc.age = req.body.age;
                    doc.code = req.body.code;
                    doc.date = today;
                    doc.save();
                    console.log("done")
                })
                .catch(err => {
                    console.error(err)
                })

            req.logout()
            res.redirect('/')



        },
        err => { console.log("err", err); }
    );
});

app.get('/donate', function(req, res) {
    res.render('donate', { about: true });
});

app.get('/unsubscribebymail', function(req, res) {
    User.deleteOne({
            email: req.query.mail // search query
        })
        .then(doc => {
            console.log("unsubscribed");
            res.render('unsubscribed', { about: false })
        })
        .catch(err => {
            console.error(err)
            res.render('error', {
                errmsg: "An error has occured. Please try again later.",
                about: false
            });
        })

});

app.get('/unsubscribe-view', function(req, res) {
    res.render('unsubscribe', { about: true });
});

app.get('/about', function(req, res) {
    res.render('about', { about: true });
});

app.get('/paymentsuccessfull', function(req, res) {
    res.render('donated', { about: true });
});