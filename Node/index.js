const https = require('https');   
n=60;

setInterval(function(){
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); 
var yyyy = today.getFullYear();

today = dd + '-' + mm + '-' + yyyy;

    for(var i = 295; i < 309;i++){
        var url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${i}&date=${today}`;
        console.log(url);
        https.get(url, function(res){
        
        });
    };



}, n * 1000);


