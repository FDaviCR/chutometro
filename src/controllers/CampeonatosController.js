const express = require('express');

const router = express.Router();
// const bcrypt = require('bcryptjs');
// const Campeonatos = require('../models/Campeonatos');

router.get('/campeonatos', (req, res) => {
    res.render('admin/campeonatos/index');
});

module.exports = router;
