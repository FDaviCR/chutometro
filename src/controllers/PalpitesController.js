const express = require('express');
const { QueryTypes } = require('sequelize');
const connection = require('../database/database');

const router = express.Router();
// const bcrypt = require('bcryptjs');
// const Palpites = require('../models/Palpites');

router.get('/palpites', async (req, res) => {
    const campeonatoPalpite = req.params.campeonatoPalpites;
    const { rodada, jogador, campeonato } = req.params;

    const partidas = await connection.query(
        `
            SELECT p.id, p.numeroPartida, m.time as Mandante, p.golsMandante, p.golsVisitante, v.time as Visitante, p.partidaRealizada
            FROM partidas AS p
            INNER JOIN times AS m ON m.id = p.mandanteId
            INNER JOIN times AS v ON v.id = p.visitanteId
            WHERE campeonatoId = ${campeonato} AND rodada = ${rodada}
        `,
        { type: QueryTypes.SELECT },
    );

    res.render('admin/palpites/index', { partidas, campeonatoPalpite, jogador });
});

module.exports = router;
