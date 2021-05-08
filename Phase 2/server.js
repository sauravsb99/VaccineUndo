const https = require('https');

setInterval(function(){
for(var i=295;i<309;i++){
    // setTimeout(function () {
    //     console.log('boo')
    //   }, 1000)
    var today = new Date();
    for(var j=0;j<2;j++){
    // setTimeout(1000);
    // setTimeout(function () {
    //     console.log('boo')
    //   }, 1000)
    var tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    var dd = String(tomorrow.getDate()).padStart(2, '0');
    var mm = String(tomorrow.getMonth() + 1).padStart(2, '0'); 
    var yyyy = tomorrow.getFullYear();
    today = tomorrow;
    var output = dd + '-' + mm + '-' + yyyy;

    var url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${i}&date=${output}`;

    https.get(url, function(res){
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
    //    console.log(data1);
    // console.log(myKey);
    for(var myKey2 in data1){
        if(data1[myKey2].available_capacity > 0){
            // console.log(data);
            console.log(data.centers[myKey].district_name);
            // console.log(myKey2);
        }
    }
    }
            // console.log("Got a response: ",data.centers);
            // var data1 = JSON.parse(data.centers);
            // console.log(data1);
        });
    }).on('error', function(e){
          console.log("Got an error: ", e);
    });


}
    




}
}, 10* 1000);
