var today = new Date();
for(var i=0;i<80;i++){
    
    var tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    var dd = String(tomorrow.getDate()).padStart(2, '0');
    var mm = String(tomorrow.getMonth() + 1).padStart(2, '0'); 
    var yyyy = tomorrow.getFullYear();
    today = tomorrow;
    var output = dd + '-' + mm + '-' + yyyy;
    console.log(output);
}
