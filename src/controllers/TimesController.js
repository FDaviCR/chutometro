const express = require('express');

const router = express.Router();
const Times = require('../models/Times');
// const bcrypt = require('bcryptjs');

/** ROTAS DE RENDERIZAÇÃO DE PÁGINAS */
router.get('/times', (req, res) => {
    Times.findAll().then((times) => {
        res.render('admin/times/index', { times });
    });
});

/** FUNÇÕES DE PROCESSAMENTO DE DADOS */

module.exports = router;
