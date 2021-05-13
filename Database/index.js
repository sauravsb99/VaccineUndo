var mongoose = require('mongoose');
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

      Vaccine
      .find()
      .then(doc => {
        doc.forEach(element => {
          element.isVerified = true;
          console.log(element.email);
          element.flag = false;
          element.save();
        }

        );
      }
      );
      


    },
    err => { console.log("err", err); }
    );