const express = require('express')
const router = express.Router()
const Toys = require('../models/toys')

router.get('/', async (req, res) => {
    let toys
    try {
      toys = await Toys.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
      toys = []
    }
    res.render('index', { toys: toys })
})

module.exports = router