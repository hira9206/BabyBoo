const mongoose = require('mongoose')

const clothesSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Clothes', clothesSchema)