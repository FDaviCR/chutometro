const express = require('express');

const router = express.Router();
// const bcrypt = require('bcryptjs');
const Partidas = require('../models/Partidas');

router.get('/partidas', (req, res) => {
    res.render('admin/partidas/index');
});

module.exports = router;
