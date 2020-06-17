const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Toys = require('../models/toys')
const uploadPath = path.join('public', Toys.imageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

// All Toys
router.get('/', async (req, res) => {
    let query = Toys.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('name', new RegExp(req.query.title, 'i'))
  }
  try {
    const toys = await query.exec()
    res.render('toys/index', {
      toys: toys,
      searchOptions: req.query
      })
    } catch {
      res.redirect('/')
    }
})

// New Toys 
router.get('/new', async (req, res) => {
    renderNewPage(res, new Toys())
})

// Create Toys 
router.post('/', upload.single('image'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null
  const toys = new Toys({
    name: req.body.name,
    description: req.body.description,
    availability: req.body.availability,
    imageName: fileName,
  })

  try {
    const newToys = await toys.save()
    // res.redirect(`toys/${newToys.id}`)
    res.redirect(`toys`)
  } catch {
    if (toys.imageName != null) {
      removeImage(toys.imageName)
    }
    renderNewPage(res, book, true)
  }
})

function removeImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) console.error(err)
  })
}

async function renderNewPage(res, toys, hasError = false) {
  try {
    const params = {
      book: book
    }
    if (hasError) params.errorMessage = 'Error Creating Toy'
    res.render('toys/new', params)
  } catch {
    res.redirect('/toys')
  }
}

module.exports = router