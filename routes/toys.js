const express = require('express')
const router = express.Router()
const Toys = require('../models/toys')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']


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
router.post('/', async (req, res) => {
  const toys = new Toys({
    name: req.body.name,
    availability: req.body.availability,
    price: req.body.price,
    description: req.body.description
  })
  saveCover(toys, req.body.cover)

  try {
    const newToys = await toys.save()
    // res.redirect(`books/${newBook.id}`)
    res.redirect(`toys`)
  } catch {
    renderNewPage(res, toys, true)
  }
})

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

function saveCover(toys, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    toys.coverImage = new Buffer.from(cover.data, 'base64')
    toys.coverImageType = cover.type
  }
}

module.exports = router 