/* eslint-disable max-len */
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
            INNER JOIN usuarios AS u ON u.id = ${jogador}
            LEFT JOIN palpites AS ppt ON p.id = ppt.partidaId and ppt.usuarioId = ${jogador}
            WHERE p.campeonatoId = ${campeonato} AND p.rodada = ${rodada} AND palpite IS NULL and (p.mandanteId <> u.timeId and p.visitanteId <> u.timeId)
        `,
        { type: QueryTypes.SELECT },
    );

    const jogadores = await connection.query(
        `
        SELECT u.id, u.usuario FROM tabelapalpites as tp
        INNER JOIN usuarios AS u ON u.id = tp.usuarioId
        INNER JOIN campeonatopalpites AS cp ON cp.id = tp.CampeonatoPalpiteId
        WHERE tp.CampeonatoPalpiteId = ${campeonatoPalpite}`,
        { type: QueryTypes.SELECT },
    );

    const rodadas = await connection.query(`SELECT rodada from partidas WHERE campeonatoId = ${campeonato} GROUP By rodada`, { type: QueryTypes.SELECT });
    const jogadorNomeRaw = await connection.query(`SELECT usuario FROM usuarios WHERE id = ${jogador}`, { type: QueryTypes.SELECT });

    const campeonatosNomesRaw = await connection.query(
        `
        SELECT CONCAT(c.Campeonato, " - ", c.Divisao, " - ", c.Ano) as campeonato, cp.apelido as campeonatoPalpite FROM campeonatos AS c
        INNER JOIN campeonatopalpites AS cp ON c.id = cp.campeonatoId
        WHERE cp.id = ${campeonatoPalpite}
        `,
        { type: QueryTypes.SELECT },
    );

    const nomeJogador = jogadorNomeRaw[0].usuario;
    const nomeCampeonato = campeonatosNomesRaw[0].campeonato;
    const nomeCampeonatoPalpite = campeonatosNomesRaw[0].campeonatoPalpite;

    res.render('public/palpites/index', {
        partidas, campeonatoPalpite, jogador, campeonato, rodada, jogadores, rodadas, nomeJogador, nomeCampeonato, nomeCampeonatoPalpite,
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
            INNER JOIN usuarios AS u ON u.id = ${jogador}
            LEFT JOIN palpites AS ppt ON p.id = ppt.partidaId and ppt.usuarioId = ${jogador}
            WHERE p.campeonatoId = ${campeonato} AND p.rodada = ${rodada} AND palpite IS NULL AND p.id != ${partidaId[0].id} and (p.mandanteId <> u.timeId and p.visitanteId <> u.timeId)
        `,
        { type: QueryTypes.SELECT },
    );

    const jogadores = await connection.query(
        `
        SELECT u.id, u.usuario FROM tabelapalpites as tp
        INNER JOIN usuarios AS u ON u.id = tp.usuarioId
        INNER JOIN campeonatopalpites AS cp ON cp.id = tp.CampeonatoPalpiteId
        WHERE tp.CampeonatoPalpiteId = ${campeonatoPalpite}`,
        { type: QueryTypes.SELECT },
    );

    const rodadas = await connection.query(`SELECT rodada from partidas WHERE campeonatoId = ${campeonato} GROUP By rodada`, { type: QueryTypes.SELECT });
    const jogadorNomeRaw = await connection.query(`SELECT usuario FROM usuarios WHERE id = ${jogador}`, { type: QueryTypes.SELECT });

    const campeonatosNomesRaw = await connection.query(
        `
        SELECT CONCAT(c.Campeonato, " - ", c.Divisao, " - ", c.Ano) as campeonato, cp.apelido as campeonatoPalpite FROM campeonatos AS c
        INNER JOIN campeonatopalpites AS cp ON cp.campeonatoId
        WHERE cp.id = ${campeonatoPalpite}
        `,
        { type: QueryTypes.SELECT },
    );

    const nomeJogador = jogadorNomeRaw[0].usuario;
    const nomeCampeonato = campeonatosNomesRaw[0].campeonato;
    const nomeCampeonatoPalpite = campeonatosNomesRaw[0].campeonatoPalpite;

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
            campeonatoPalpite, jogador, campeonato, partidas, rodada, jogadores, rodadas, nomeJogador, nomeCampeonato, nomeCampeonatoPalpite,
        });
    });
});

router.get('/palpites/list/:campeonatoPalpite/:rodada/:jogador', async (req, res) => {
    const { rodada, jogador, campeonatoPalpite } = req.params;

    const partidas = await connection.query(
        `
            SELECT ppt.partidaId, m.time as mandante, v.time AS visitante, ppt.palpite,
            CASE
                WHEN ppt.palpite = 0 THEN 'Empate'
                WHEN ppt.palpite > 0 THEN pu.time

            END AS Palpite
            FROM palpites AS ppt
            INNER JOIN partidas AS p ON ppt.partidaId = p.id
            INNER JOIN times AS m ON m.id = p.mandanteId
            INNER JOIN times AS v ON v.id = p.visitanteId
            INNER JOIN campeonatopalpites AS cp ON ppt.campeonatoPalpiteId = cp.id
            LEFT JOIN times AS pu ON pu.id = ppt.palpite
            WHERE ppt.rodada = ${rodada} AND ppt.CampeonatoPalpiteId = ${campeonatoPalpite} AND ppt.usuarioId = ${jogador}

        `,
        { type: QueryTypes.SELECT },
    );

    res.render('public/palpites/list', {
        partidas, campeonatoPalpite, jogador, rodada,
    });
});

module.exports = router;
