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

// setInterval(function(){
for(var i=295;i<309;i++){
    // setTimeout(function () {
    //     // console.log('boo')
    //   }, 12000)
    var today = new Date();
    for(var j=0;j<1;j++){
    // setTimeout(1000);
    // setTimeout(function () {
    //     // console.log('boo')
    //   }, 12000)
    var tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    var dd = String(tomorrow.getDate()).padStart(2, '0');
    var mm = String(tomorrow.getMonth() + 1).padStart(2, '0'); 
    var yyyy = tomorrow.getFullYear();
    today = tomorrow;
    var output = dd + '-' + mm + '-' + yyyy;

    var url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${i}&date=${output}`;

    https.get(url,(function(i) {return function(res){
        var body = '';
    
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
            
            // var myJson = {'key':'value', 'key2':'value2'};
    for(var myKey in data.centers) 
    {
       var data1 = data.centers[myKey].sessions;
       console.log(i);
    // console.log(myKey);
    for(var myKey2 in data1){
        // console.log(data1[myKey2].available_capacity);
        // console.log(data.centers[myKey].district_name);
        // console.log(data.centers[myKey].name);
        // console.log(output);
        // console.log(data1[myKey2].min_age_limit);
        if(data1[myKey2].available_capacity > 0){
            // console.log(data.centers[myKey].district_name);
            Vaccine
                    .find({
                        code: data.centers[myKey].district_name 
                    })
                    .then(doc => {
                        doc.forEach(element => {
                            // console.log(element);
                            if(element.isVerified==true){
                                if(element.flag==false){
                                    if(element.age==data1[myKey2].min_age_limit){
                                        link="https://selfregistration.cowin.gov.in/"
                                        mailOptions = {
                                            to: element.email,
                                            subject: "Vaccine Available in your area",
                                            html: "Hello,<br>Vaccines are available in <br>"+data.centers[myKey].name+"<br>Date"+output+"<br>"+"Please Click on the link to book your slot.<br><a href=" + link + ">CoWin</a><br>"
                                        }
                                        console.log(mailOptions);
                                        transporter.sendMail(mailOptions, function(err, info) {
                                            if (err)
                                                console.log(err);
                                            else
                                                console.log('Email sent: ' + info.response);
                                        });
                                    }
                                    element.flag=true;
                                    var x = new Date();
                                    var y = String(x.getDate()).padStart(2, '0');
                                    var z = String(x.getMonth() + 1).padStart(2, '0');
                                    var k = x.getFullYear();
                                    x = y + '-' + z + '-' + k;
                                    element.date=x;
                                    element.save();
                                }
                                else{
                                    var x = new Date();
                                    var y = String(x.getDate()).padStart(2, '0');
                                    var z = String(x.getMonth() + 1).padStart(2, '0');
                                    var k = x.getFullYear();
                                    x = y + '-' + z + '-' + k;
                                    if(element.date!=x){
                                        if(element.age==data1[myKey2].min_age_limit){
                                            link="https://selfregistration.cowin.gov.in/"
                                            mailOptions = {
                                                to: element.email,
                                                subject: "Vaccine Available in your area",
                                                html: "Hello,<br> Please Click on the link to go to cowin.<br><a href=" + link + ">CoWin</a><br>"
                                            }
                                            console.log(mailOptions);
                                            transporter.sendMail(mailOptions, function(err, info) {
                                                if (err)
                                                    console.log(err);
                                                else
                                                    console.log('Email sent: ' + info.response);
                                            });
                                        }
                                        element.flag=true;
                                        var x = new Date();
                                        var y = String(x.getDate()).padStart(2, '0');
                                        var z = String(x.getMonth() + 1).padStart(2, '0');
                                        var k = x.getFullYear();
                                        x = y + '-' + z + '-' + k;
                                        element.date=x;
                                        element.save();

                                    }
                                }

                            }
                          });
                        

                    })
                    .catch(err => {
                        console.error(err)
                    })
            // console.log(data);
            // console.log(data.centers[myKey].district_name);
            // console.log(myKey2);
        }
    }
    }
            // console.log("Got a response: ",data.centers);
            // var data1 = JSON.parse(data.centers);
            // console.log(data1);
        });
    }.on('error', function(e){
          console.log("Got an error: ", e);
    });
}(i)));



}//j
    




}
// }, 300* 1000);

},
err => { console.log("err", err); }
);