const express = require('express')
const Clothes = require('../models/Clothes')
const router = express.Router()

// All Clothes 
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
      const clothes = await Clothes.find(searchOptions)
      res.render('clothes/index', { 
          clothes : clothes, 
          searchOptions: req.query
        })
    } catch {
      res.redirect('/')
    }
})

// New Clothes 
router.get('/new', (req, res) => {
    res.render('clothes/new', { clothes: new Clothes() })
})

// Create Clothes 
router.post('/', async (req, res) => {
    const clothes = new Clothes({
        name: req.body.name
    })
    try{
        const newClothes = await clothes.save()
        //res.redirect('clothes/${newClothes.id}')
        res.redirect('clothes')
    } catch {
        res.render('clothes/new', {
            clothes: clothes,
            errorMessage: 'Error creating Clothes'
        })
    }
})

module.exports = router