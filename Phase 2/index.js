const https = require('https');
var mongoose = require('mongoose');
var nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
let transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: "vaccineundo",
        pass: "vaccine@undo.com"
    }
}));
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

    for(var i=295;i<309;i++){

        var today = new Date();
        
        for(var j=0;j<3;j++){
            var tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)
            var dd = String(tomorrow.getDate()).padStart(2, '0');
            var mm = String(tomorrow.getMonth() + 1).padStart(2, '0'); 
            var yyyy = tomorrow.getFullYear();
            today = tomorrow;
            var output = dd + '-' + mm + '-' + yyyy;
            var url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${i}&date=${output}`;
            
            https.get(url,(function(i,output) {return function(res){
                // console.log(output);
                
                var body = '';
                var district='';
                var arr18 = [];
                var arr45 = [];
                res.on('data', function(chunk){
                    body += chunk;
                });
        
                res.on('end', function(){
                try{
                    var data = JSON.parse(body);
                }
                catch(e){
                    console.log(e);
                }
 
                for(var myKey in data.centers) 
                {
                    var data1 = data.centers[myKey].sessions;
                    for(var myKey2 in data1){
                        if(data1[myKey2].available_capacity > 0){
                                    district = data.centers[myKey].district_name;
                                    console.log(data.centers[myKey].district_name);
                                    console.log(data.centers[myKey].name);
                                    console.log(data1[myKey2].available_capacity);
                                    console.log(output);
                                    console.log(data1[myKey2].min_age_limit);
                                    if(data1[myKey2].min_age_limit == "18"){
                                        arr18.push(`${data.centers[myKey].name} - ${output}`);
                                    }
                                    else{
                                        arr45.push(`${data.centers[myKey].name} - ${output}`);
                                    }
                                    

                                    
                                    // }
                                    // getFirstUserData();

                        }
                    }
                    // getVaccine();
                    // console.log(i);
                }
                
                // const getVaccine = async () => {
                Vaccine
                .find({
                    code: district
                })
                .then(doc => {
                    doc.forEach(element => {
                        // console.log(i);
                        if(element.isVerified==true){
                            if(element.flag==false){
                                if(element.age=="18" & arr18.length!=0){
                                    const getFirstUserData = async () => {
                                    element.flag=true;
                                    var x = new Date();
                                    var y = String(x.getDate()).padStart(2, '0');
                                    var z = String(x.getMonth() + 1).padStart(2, '0');
                                    var k = x.getFullYear();
                                    x = y + '-' + z + '-' + k;
                                    element.date=x;
                                    element.save();
                                    }
                                    getFirstUserData();
                                    link="https://selfregistration.cowin.gov.in/";
                                    html_writeup = "Hello,<br>Vaccines are available in <br>";
                                    for(var o = 0;o<arr18.length;o++){
                                        html_writeup+="<br>"+arr18[o];
                                    }
                                    html_writeup+="<br>Please Click on the link to book your slot.<br><a href=" + link + ">CoWin</a><br>"
                                    mailOptions = {
                                        to: element.email,
                                        subject: "Vaccine Available in your area",
                                        html: html_writeup }
                                        // console.log(arr);
                                    console.log(mailOptions);
                                    transporter.sendMail(mailOptions, function(err, info) {
                                        if (err)
                                            console.log(err);
                                        else
                                            console.log('Email sent: ' + info.response);
                                    });
                                }
                                else if(element.age=="45" & arr45.length!=0){
                                        element.flag=true;
                                        var x = new Date();
                                        var y = String(x.getDate()).padStart(2, '0');
                                        var z = String(x.getMonth() + 1).padStart(2, '0');
                                        var k = x.getFullYear();
                                        x = y + '-' + z + '-' + k;
                                        element.date=x;
                                        element.save();
                                        
                                        link="https://selfregistration.cowin.gov.in/";
                                        html_writeup = "Hello,<br>Vaccines are available in <br>";
                                        for(var o = 0;o<arr45.length;o++){
                                            html_writeup+="<br>"+arr45[o];
                                        }
                                        html_writeup+="<br>Please Click on the link to book your slot.<br><a href=" + link + ">CoWin</a><br>"
                                        mailOptions = {
                                            to: element.email,
                                            subject: "Vaccine Available in your area",
                                            html: html_writeup }
                                            // console.log(arr);
                                        console.log(mailOptions);
                                        transporter.sendMail(mailOptions, function(err, info) {
                                            if (err)
                                                console.log(err);
                                            else
                                                console.log('Email sent: ' + info.response);
                                        });
                                }
                                
                            }
                            else{
                                var x = new Date();
                                var y = String(x.getDate()).padStart(2, '0');
                                var z = String(x.getMonth() + 1).padStart(2, '0');
                                var k = x.getFullYear();
                                x = y + '-' + z + '-' + k;
                                if(element.date!=x){
                                    html_writeup = "Hello,<br>Vaccines are available in <br>";
                                    if(element.age=="18" & arr18.length!=0){
                                        for(var o = 0;o<arr18.length;o++){
                                            html_writeup+="<br>"+arr18[o];
                                        }
                                        link="https://selfregistration.cowin.gov.in/";
                                    html_writeup+="<br>Please Click on the link to book your slot.<br><a href=" + link + ">CoWin</a><br>"
                                    
                                        mailOptions = {
                                            to: element.email,
                                            subject: "Vaccine Available in your area",
                                            html: html_writeup
                                         }
                                        console.log(mailOptions);
                                        transporter.sendMail(mailOptions, function(err, info) {
                                            if (err)
                                                console.log(err);
                                            else
                                                console.log('Email sent: ' + info.response);
                                        });
                                    }
                                    else if(element.age=="45" & arr45.length!=0){
                                        for(var o = 0;o<arr45.length;o++){
                                            html_writeup+="<br>"+arr45[o];
                                    }
                                    link="https://selfregistration.cowin.gov.in/";
                                    html_writeup+="<br>Please Click on the link to book your slot.<br><a href=" + link + ">CoWin</a><br>"
                                    
                                        mailOptions = {
                                            to: element.email,
                                            subject: "Vaccine Available in your area",
                                            html: html_writeup
                                         }
                                        console.log(mailOptions);
                                        transporter.sendMail(mailOptions, function(err, info) {
                                            if (err)
                                                console.log(err);
                                            else
                                                console.log('Email sent: ' + info.response);
                                        });
                                }
                                        
                                    
                                    // }
                                    // element.flag=true;
                                    // var x = new Date();
                                    // var y = String(x.getDate()).padStart(2, '0');
                                    // var z = String(x.getMonth() + 1).padStart(2, '0');
                                    // var k = x.getFullYear();
                                    // x = y + '-' + z + '-' + k;
                                    // element.date=x;
                                    // element.save();

                                }
                            }

                        }
                    });
                    

                    })
                    .catch(err => {
                        console.error(err)
                    })
                // }
                // getVaccine();   
                
            });
            }
            }
            )(i,output));
        }
    }

},
err => { console.log("err", err); }
);