const express = require('express');

const router = express.Router();
// const bcrypt = require('bcryptjs');
const CampeonatoPaltipes = require('../models/CampeonatoPalpites');
const Campeonatos = require('../models/Campeonatos');

/** ROTAS DE RENDERIZAÇÃO DE PÁGINAS */
router.get('/campeonato-palpites', (req, res) => {
    CampeonatoPaltipes.findAll().then((campeonatos) => {
        res.render('admin/campeonatoPalpites/index', { campeonatos });
    });
});

router.get('/admin/campeonato-palpites/create', (req, res) => {
    Campeonatos.findAll().then((campeonatos) => {
        res.render('admin/campeonatoPalpites/create', { campeonatos });
    });
});

/** FUNÇÕES DE PROCESSAMENTO DE DADOS */
router.post('/campeonato-palpites/create', (req, res) => {
    const { campeonatoPalpite } = req.body;
    const campeonatoId = req.body.campeonato;

    CampeonatoPaltipes.findOne({ where: { apelido: campeonatoPalpite } }).then((campPalpite) => {
        if (campPalpite === undefined || campPalpite === null) {
            CampeonatoPaltipes.create({
                apelido: campeonatoPalpite,
                campeonatoId,
                ativo: true,
            }).then(() => {
                res.redirect('/campeonato-palpites');
            }).catch((err) => {
                console.log(err);
            });
        } else {
            res.redirect('/campeonato-palpites');
        }
    });
});

module.exports = router;
