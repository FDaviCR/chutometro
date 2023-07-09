const express = require('express');
const { QueryTypes } = require('sequelize');
const connection = require('../database/database');

const router = express.Router();
// const bcrypt = require('bcryptjs');
// const Partidas = require('../models/Partidas');
// const Times = require('../models/Times');

/** ROTAS DE RENDERIZAÇÃO DE PÁGINAS */
router.get('/partidas', async (req, res) => {
    const partidas = await connection.query('SELECT partidas.id, partidas.numeroPartida, m.time as Mandante, partidas.golsMandante, partidas.golsVisitante, v.time as Visitante FROM partidas INNER JOIN times AS m ON m.id = partidas.mandanteId INNER JOIN times AS v ON v.id = partidas.visitanteId', { type: QueryTypes.SELECT });

    res.render('public/partidas/index', { partidas });
});

router.get('/partidas/campeonato/:idCampeonato', async (req, res) => {
    const edicao = req.params.idCampeonato;
    const partidas = await connection.query('SELECT partidas.id, partidas.numeroPartida, m.time as Mandante, partidas.golsMandante, partidas.golsVisitante, v.time as Visitante FROM partidas INNER JOIN times AS m ON m.id = partidas.mandanteId INNER JOIN times AS v ON v.id = partidas.visitanteId WHERE campeonatoId = :edicao', { replacements: { edicao }, type: QueryTypes.SELECT });

    res.render('public/partidas/index', { partidas });
});

router.get('/partidas/campeonato/:idCampeonato/:rodada', async (req, res) => {
    const campeonato = req.params.idCampeonato;
    const { rodada } = req.params;

    const partidas = await connection.query(`SELECT partidas.id, partidas.numeroPartida, m.time as Mandante, partidas.golsMandante, partidas.golsVisitante, v.time as Visitante FROM partidas INNER JOIN times AS m ON m.id = partidas.mandanteId INNER JOIN times AS v ON v.id = partidas.visitanteId WHERE campeonatoId = ${campeonato} and rodada = ${rodada}`, { type: QueryTypes.SELECT });

    res.render('public/partidas/index', { partidas });
});

/** FUNÇÕES DE PROCESSAMENTO DE DADOS */

module.exports = router;
