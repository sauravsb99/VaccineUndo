const express = require('express')
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/public', express.static('public'));
app.use(expressLayouts);
app.set('view engine', 'ejs');
var mongoose = require('mongoose');
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "vaccineundo",
        pass: "vaccine@undo.com"
    }
});
const vaccineSchema = mongoose.Schema({
    email: String,
    age: String,
    code: String,
    flag: Boolean,
    date: String,
    hash: Number,
    isVerified: Boolean
});
var Vaccine = mongoose.model('Vaccine', vaccineSchema);
mongoose.connect('mongodb+srv://vaccineundo:vaccineundo.com@cluster0.uo2id.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').then(
    () => {

        console.log("connected")
        app.listen(3000, function() {});

        app.get('/', (req, res) => {
            res.render('index');
        });
        app.post('/submit', (req, res) => {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = dd + '-' + mm + '-' + yyyy;
            rand = Math.floor((Math.random() * 100000) + 54);

            //mail

            host = req.get('host');
            link = "http://" + req.get('host') + "/verify?id=" + rand + "&mail=" + req.body.mail;
            unsubLink = "http://" + req.get('host') + "/unsubscribe?mail=" + req.body.mail;
            mailOptions = {
                to: req.body.mail,
                subject: "Please confirm your Email account",
                html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a><br><p>If you don't want to receive emails from us anymore, you can <a href=" + unsubLink + ">unsubscribe</a></p>"
            }
            console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function(error, response) {
                if (error) {
                    console.log(error);
                    res.end("error");
                } else {
                    console.log("Message sent: " + response.message);
                    res.end("sent");
                }
            });


            //mail




            console.log(req.body);
            var awesome_instance = new Vaccine({ email: req.body.mail, age: req.body.age, code: req.body.code, flag: 0, date: today, hash: rand, isVerified: 0 });

            awesome_instance.save(function(err) {
                if (err) return handleError(err);
            });
            res.redirect('/');
        });
        app.get('/verify', function(req, res) {
            console.log(req.protocol + ":/" + req.get('host'));
            if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
                console.log(req.query.id);
                console.log(req.query.mail);
                Vaccine
                    .findOne({
                        email: req.query.mail // search query
                    })
                    .then(doc => {
                        console.log(doc.hash);
                        if (req.query.id == doc.hash) {
                            doc.isVerified = true;
                            doc.save();

                            console.log("email is verified");
                            res.render('verified')
                        } else {
                            console.log("email is not verified");
                            res.render('error', {
                                errmsg: "Bad Request"
                            });
                        }
                        // console.log()

                    })
                    .catch(err => {
                        console.error(err)
                    })
                    // Vaccine.findOneAndUpdate({email:req.query.mail},{$set:{isVerified:true}});
                    // // console.log(Vaccine.findOne({email:req.range.mail}));
                    // if(req.query.id==Vaccine.findOne({email:req.range.mail}).hash)
                    // {
                    //     console.log("email is verified");
                    //     res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
                    // }
                    // else
                    // {
                    //     console.log("email is not verified");
                    //     res.end("<h1>Bad Request</h1>");
                    // }
            } else {
                res.end("<h1>Request is from unknown source");
            }
        });

        app.get('/unsubscribe', function(req, res) {
            console.log(req.protocol + ":/" + req.get('host'));
            if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
                console.log(req.query.id);
                console.log(req.query.mail);
                Vaccine
                    .deleteOne({
                        email: req.query.mail // search query
                    })
                    .then(doc => {
                        console.log("unsubscribed");
                        res.render('unsubscribed')
                    })
                    .catch(err => {
                        console.error(err)
                        res.render('error', {
                            errmsg: "Bad Request"
                        });
                    })
            } else {
                res.render('error', { errmsg: "Request is from unknown source" });
            }
        });
    },
    err => { console.log("err", err); }
);