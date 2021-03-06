const express = require('express')
const router = express.Router()
const Clothes = require('../models/Clothes')

// All Clothes 
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
      const clothes = await Clothes.find(searchOptions)
      res.render('Clothes/index', { 
          clothes : clothes, 
          searchOptions: req.query
        })
    } catch {
      res.redirect('/')
    }
})

// New Clothes 
router.get('/new', (req, res) => {
    res.render('Clothes/new', { clothes: new Clothes() })
})

// Create Clothes 
router.post('/', async (req, res) => {
    const clothes = new Clothes({
        name: req.body.name
    })
    try{
        const newClothes = await clothes.save()
        //res.redirect('clothes/${newClothes.id}')
        res.redirect('Clothes')
    } catch {
        res.render('Clothes/new', {
            clothes: clothes,
            errorMessage: 'Error creating Clothes'
        })
    }
})

module.exports = router