const mongoose = require('mongoose')
const path = require('path')

const imageBasePath = 'uploads/images'

const toysSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    availability: {
        type: Number,
        required: true
    },
    createdAT: {
        type: Date,
        required: true,
        default: Date.now
    },
    imageName: {
        type: String,
        required: true,
    },
})

toysSchema.virtual('imagePath').get(function() {
    if (this.imageName != null) {
      return path.join('/', imageBasePath, this.imageName)
    }
  })

module.exports = mongoose.model('Toys', toysSchema)
module.exports.imageBasePath = imageBasePath