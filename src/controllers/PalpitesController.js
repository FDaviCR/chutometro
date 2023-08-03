const express = require('express');
const { QueryTypes } = require('sequelize');
const connection = require('../database/database');

const router = express.Router();
// const bcrypt = require('bcryptjs');
const Palpites = require('../models/Palpites');

router.get('/palpites/:campeonato/:campeonatoPalpites/:jogador/:rodada', async (req, res) => {
    const campeonatoPalpite = req.params.campeonatoPalpites;
    const { rodada, jogador, campeonato } = req.params;

    const partidas = await connection.query(
        `
            SELECT p.id, p.numeroPartida, m.time as Mandante, m.id as idMandante, p.golsMandante, p.golsVisitante, v.time as Visitante, v.id as idVisitante, p.partidaRealizada
            FROM partidas AS p
            INNER JOIN times AS m ON m.id = p.mandanteId
            INNER JOIN times AS v ON v.id = p.visitanteId
            WHERE campeonatoId = ${campeonato} AND rodada = ${rodada}
        `,
        { type: QueryTypes.SELECT },
    );

    res.render('public/palpites/index', { partidas, campeonatoPalpite, jogador });
});

router.post('/palpite/save', async (req, res) => {
    console.log(req.body);
    return 0;
});

module.exports = router;
