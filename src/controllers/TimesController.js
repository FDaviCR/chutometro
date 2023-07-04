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

router.get('/admin/times/create', (req, res) => {
    res.render('admin/times/create');
});

/** FUNÇÕES DE PROCESSAMENTO DE DADOS */

router.post('/times/create', (req, res) => {
    const nomeTime = req.body.time;

    Times.findOne({ where: { time: nomeTime } }).then((time) => {
        if (time === undefined || time === null) {
            Times.create({
                time: nomeTime,
                ativo: true,
            }).then(() => {
                res.redirect('/times');
            }).catch((err) => {
                console.log(err);
            });
        } else {
            res.redirect('/times');
        }
    });
});

module.exports = router;
