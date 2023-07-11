const express = require('express');

const router = express.Router();
// const bcrypt = require('bcryptjs');
const Campeonatos = require('../models/Campeonatos');

router.get('/campeonatos', (req, res) => {
    Campeonatos.findAll().then((campeonatos) => {
        res.render('admin/campeonatos/index', { campeonatos });
    });
});

module.exports = router;
