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
    const { nomeTime } = req.body.time;

    Times.findOne({ where: { nomeTime } }).then((time) => {
        if (time === undefined || time === null) {
            Times.create({
                nomeTime,
                ativo: true,
            }).then(() => {
                if (req.session.usuario === undefined) {
                    res.redirect('/');
                } else {
                    res.redirect('/admin/times');
                }
            }).catch((err) => {
                console.log(err);
            });
        } else {
            res.redirect('/admin/times');
        }
    });
});

module.exports = router;
