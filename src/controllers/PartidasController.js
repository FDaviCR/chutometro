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
    const campeonatos = await connection.query('SELECT * FROM campeonatos', { type: QueryTypes.SELECT });
    const rodadas = await connection.query(`SELECT rodada from partidas WHERE campeonatoId = ${campeonatos[0].id} GROUP By rodada`, { type: QueryTypes.SELECT });

    res.render('public/partidas/indexAll', { partidas, campeonatos, rodadas });
});

router.get('/partidas/campeonato/:idCampeonato', async (req, res) => {
    const edicao = req.params.idCampeonato;
    const partidas = await connection.query('SELECT partidas.id, partidas.numeroPartida, m.time as Mandante, partidas.golsMandante, partidas.golsVisitante, v.time as Visitante FROM partidas INNER JOIN times AS m ON m.id = partidas.mandanteId INNER JOIN times AS v ON v.id = partidas.visitanteId WHERE campeonatoId = :edicao', { replacements: { edicao }, type: QueryTypes.SELECT });

    res.render('public/partidas/indexAll', { partidas });
});

router.get('/partidas/campeonato/:idCampeonato/:rodada', async (req, res) => {
    const campeonato = req.params.idCampeonato;
    const { rodada } = req.params;

    const campeonatos = await connection.query('SELECT * FROM campeonatos', { type: QueryTypes.SELECT });
    const partidas = await connection.query(`SELECT partidas.id, partidas.numeroPartida, m.time as Mandante, partidas.golsMandante, partidas.golsVisitante, v.time as Visitante FROM partidas INNER JOIN times AS m ON m.id = partidas.mandanteId INNER JOIN times AS v ON v.id = partidas.visitanteId WHERE campeonatoId = ${campeonato} and rodada = ${rodada}`, { type: QueryTypes.SELECT });
    const rodadas = await connection.query(`SELECT rodada from partidas WHERE campeonatoId = ${campeonatos[0].id} GROUP By rodada`, { type: QueryTypes.SELECT });
    const torneioRaw = await connection.query(`SELECT concat(c.Campeonato," - ",c.Divisao," - ", c.Ano) as campeonato FROM campeonatos as c where id = ${campeonato}`, { type: QueryTypes.SELECT });

    const torneio = torneioRaw[0].campeonato;
    res.render('public/partidas/index', {
        partidas, campeonatos, rodadas, torneio, rodada,
    });
});

/** FUNÇÕES DE PROCESSAMENTO DE DADOS */

module.exports = router;
