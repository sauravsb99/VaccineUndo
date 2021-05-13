const mongoose = require('mongoose')

const VaccineSchema = new mongoose.Schema({
  email: String,
    age: String,
    code: String,
    flag: Boolean,
    date: String,
    isVerified: Boolean
})

module.exports = mongoose.model('Vaccine', VaccineSchema)
