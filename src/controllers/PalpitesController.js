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
            LEFT JOIN palpites AS ppt ON p.id = ppt.partidaId and ppt.usuarioId = ${jogador}
            WHERE p.campeonatoId = ${campeonato} AND p.rodada = ${rodada} AND palpite IS NULL
        `,
        { type: QueryTypes.SELECT },
    );

    res.render('public/palpites/index', {
        partidas, campeonatoPalpite, jogador, campeonato, rodada,
    });
});

router.post('/palpite/save', async (req, res) => {
    const {
        jogador, campeonato, campeonatoPalpite, palpite, partida, rodada,
    } = req.body;

    const partidaId = await connection.query(`SELECT partidas.id FROM partidas WHERE campeonatoId = ${campeonato} and numeroPartida = ${partida}`, { type: QueryTypes.SELECT });

    const partidas = await connection.query(
        `
            SELECT p.id, p.numeroPartida, m.time as Mandante, m.id as idMandante, p.golsMandante, p.golsVisitante, v.time as Visitante, v.id as idVisitante, p.partidaRealizada
            FROM partidas AS p
            INNER JOIN times AS m ON m.id = p.mandanteId
            INNER JOIN times AS v ON v.id = p.visitanteId
            LEFT JOIN palpites AS ppt ON p.id = ppt.partidaId and ppt.usuarioId = ${jogador}
            WHERE p.campeonatoId = ${campeonato} AND p.rodada = ${rodada} AND palpite IS NULL
        `,
        { type: QueryTypes.SELECT },
    );

    Palpites.create({
        rodada,
        palpite,
        valido: false,
        partidaId: partidaId[0].id,
        usuarioId: jogador,
        campeonatoId: campeonato,
        CampeonatoPalpiteId: campeonatoPalpite,
        resultado: false,
    }).then(() => {
        res.render('public/palpites/index', {
            campeonatoPalpite, jogador, campeonato, partidas, rodada,
        });
    });
});

module.exports = router;
