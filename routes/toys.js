const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Toys = require('../models/toys')
const uploadPath = path.join('public', Toys.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

// All Toys Route
router.get('/', async (req, res) => {
  let query = Toys.find()
  if (req.query.name != null && req.query.name != '') {
    query = query.regex('name', new RegExp(req.query.name, 'i'))
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

// New Toys Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Toys())
})

// Create Toys Route
router.post('/', upload.single('cover'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null
  const toys = new Toys({
    name: req.body.name,
    availability: req.body.availability,
    price: req.body.price,
    coverImageName: fileName,
    description: req.body.description
  })

  try {
    const newToys = await toys.save()
    // res.redirect(`books/${newBook.id}`)
    res.redirect(`toys`)
  } catch {
    if (toys.coverImageName != null) {
      removeToysCover(toys.coverImageName)
    }
    renderNewPage(res, toys, true)
  }
})

function removeToysCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) console.error(err)
  })
}

async function renderNewPage(res, toys, hasError = false) {
  try {
    const params = {
      toys: toys
    }
    if (hasError) params.errorMessage = 'Error Creating Toy'
    res.render('toys/new', params)
  } catch {
    res.redirect('/toys')
  }
}

module.exports = router 