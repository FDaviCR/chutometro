const express = require('express');
const { QueryTypes } = require('sequelize');
const connection = require('../database/database');

const router = express.Router();
// const bcrypt = require('bcryptjs');
const CampeonatoPaltipes = require('../models/CampeonatoPalpites');
const Usuarios = require('../models/Usuarios');
// const TabelaPalpites = require('../models/TabelaPalpites');

/** ROTAS DE RENDERIZAÇÃO DE PÁGINAS */
router.post('/tabela-palpites', async (req, res) => {
    const { idCampeonato } = req.body;

    if (idCampeonato !== undefined) {
        if (!Number.isNaN(idCampeonato)) {
            const campeonatos = await connection.query(
`
                SELECT tp.id, u.usuario, cp.apelido FROM tabelapalpites as tp
                INNER JOIN usuarios AS u ON u.id = tp.usuarioId
                INNER JOIN campeonatopalpites AS cp ON cp.id = tp.CampeonatoPalpiteId
                WHERE tp.CampeonatoPalpiteId = ${idCampeonato}`,
            { type: QueryTypes.SELECT },
);

            res.render('admin/tabelaPalpites/index', { campeonatos, idCampeonato });
        } else {
            res.render('/usuarios');
        }
    } else {
        res.redirect('/');
    }
});

router.get('/tabela-palpites/add-user', (req, res) => {
    const { idCampeonato } = req.body;

    Usuarios.findAll().then((usuarios) => {
        res.render('admin/tabelaPalpites/create', { usuarios, idCampeonato });
    });
});
/*
router.get('/admin/tabela-palpites/create', (req, res) => {
    CampeonatoPaltipes.findAll().then((campeonatos) => {
        res.render('admin/tabelaPalpites/create', { campeonatos });
    });
});
*/
/** FUNÇÕES DE PROCESSAMENTO DE DADOS */
router.post('/tabela-palpites/create', (req, res) => {
    const { campeonatoPalpite } = req.body;
    const campeonatoId = req.body.campeonato;
    const usuarioId = req.body.usuario;

    CampeonatoPaltipes.findOne({ where: { apelido: campeonatoPalpite } }).then((campPalpite) => {
        if (campPalpite === undefined || campPalpite === null) {
            CampeonatoPaltipes.create({
                apelido: campeonatoPalpite,
                usuarioId,
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
