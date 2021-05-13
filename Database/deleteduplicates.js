var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb+srv://vaccineundo:vaccineundo.com@cluster0.uo2id.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect('mongodb+srv://vaccineundo:vaccineundo.com@cluster0.uo2id.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').then(
    () => {
        var duplicates = [];

        var db = mongoose.connection;
        try{
            db.collection('vaccines').aggregate([
                { $match: { 
                  email: { "$ne": '' }  // discard selection criteria
                }},
                { $group: { 
                  _id: { email: "$email"}, // can be grouped on multiple properties 
                  dups: { "$addToSet": "$_id" }, 
                  count: { "$sum": 1 } 
                }},
                { $match: { 
                  count: { "$gt": 1 }    // Duplicates considered as count greater than one
                }}
              ],
              {allowDiskUse: true}       // For faster processing if set is larger
              )               // You can display result until this and check duplicates 
              .forEach(function(doc) {
                  doc.dups.shift();      // First element skipped for deleting
                  doc.dups.forEach( function(dupId){ 
                      duplicates.push(dupId); 
                      console.log(dupId) 
                      db.collection('vaccines').remove({_id:dupId}) // Getting all duplicate ids
                      }
                  )
                console.log(doc)
              })
        }
        catch{
            console.log("ayyo")
        }
        
        //   console.log(duplicates)
})

