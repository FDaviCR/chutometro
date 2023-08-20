const express = require('express');
const { QueryTypes } = require('sequelize');
const connection = require('../database/database');

const router = express.Router();
// const bcrypt = require('bcryptjs');
const CampeonatoPaltipes = require('../models/CampeonatoPalpites');
const Campeonatos = require('../models/Campeonatos');
const Palpite = require('../models/Palpites');

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

router.post('/campeonato-palpites/processar/:idCampeonato/:rodada', async (req, res) => {
    const { idCampeonato, rodada } = req.params;

    const partidas = await connection.query(`
        SELECT r.* from partidas AS p
        INNER JOIN resultadospartidas AS r ON p.id = r.partidaId
        WHERE p.campeonatoId = ${idCampeonato} and p.rodada = ${rodada}
    `, { type: QueryTypes.SELECT });

    partidas.forEach(async (partida) => {
        const palpites = await connection.query(`
            SELECT * FROM palpites WHERE partidaId = ${partida.partidaId}
        `, { type: QueryTypes.SELECT });

        palpites.forEach(async (palpite) => {
            if (palpite.palpite === partida.partida.resultado) {
                Palpite.update(
                    { valido: 1, resultado: 1 },
                    { where: { partidaId: partida.partidaId } },
                );
            } else {
                Palpite.update(
                    { valido: 1, resultado: 0 },
                    { where: { partidaId: partida.partidaId } },
                );
            }
        });
    });

    res.redirect();
});

router.get('/campeonato-palpites/list/:idCampeonato/:rodada', async (req, res) => {
    const { idCampeonato, rodada } = req.params;

    res.redirect();
});

module.exports = router;
