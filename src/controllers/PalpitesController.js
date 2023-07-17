const express = require('express');

const router = express.Router();
// const bcrypt = require('bcryptjs');
const Palpites = require('../models/Palpites');

router.get('/palpites', (req, res) => {
    Palpites.findAll().then((palpites) => {
        res.render('admin/palpites/index', { palpites });
    });
});

module.exports = router;
