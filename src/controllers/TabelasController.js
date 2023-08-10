const express = require('express');

const router = express.Router();
const Tabelas = require('../models/Tabelas');
// const bcrypt = require('bcryptjs');

router.get('/tabelas', (req, res) => {
    res.render('admin/tabelas/index');
});

module.exports = router;
