const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Toys = require('../models/toys')
const Clothes = require('../models/Clothes')
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
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
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
    title: req.body.title,
    clothes: req.body.clothes,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
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
    const clothes = await Clothes.find({})
    const params = {
      clothes: clothes,
      toys: toys
    }
    if (hasError) params.errorMessage = 'Error Creating Toy'
    res.render('toys/new', params)
  } catch {
    res.redirect('/toys')
  }
}

module.exports = router 