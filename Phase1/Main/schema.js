var mongoose = require('mongoose');
const vaccineSchema = mongoose.Schema({
    email:String,
    age:String,
    code:String,
    flag:Boolean,
    date:Date
});
module.exports = mongoose.model('vaccine',vaccineSchema);