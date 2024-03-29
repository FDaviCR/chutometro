const express = require('express');
const { QueryTypes } = require('sequelize');
const connection = require('../database/database');

const router = express.Router();
const Tabela = require('../models/Tabelas');
const Time = require('../models/Times');

const processarResultadosPartidas = require('../functions/processarResultadosPartidas');
const processarResultadosTabela = require('../functions/processarResultadosTabela');

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

router.get('/partidas/processar-resultados/:idCampeonato/:rodada', async (req, res) => {
    const { idCampeonato, rodada } = req.params;

    const campeonatos = await connection.query('SELECT * FROM campeonatos', { type: QueryTypes.SELECT });
    const rodadas = await connection.query(`SELECT rodada from partidas WHERE campeonatoId = ${campeonatos[0].id} GROUP By rodada`, { type: QueryTypes.SELECT });

    const campeonatosNomesRaw = await connection.query(
        `
        SELECT CONCAT(c.Campeonato, " - ", c.Divisao, " - ", c.Ano) as campeonato FROM campeonatos AS c
        WHERE c.id = ${idCampeonato}
        `,
        { type: QueryTypes.SELECT },
    );

    const nomeCampeonato = campeonatosNomesRaw[0].campeonato;

    async function redirecionarTabela() {
        Tabela.findAll({
            where: { campeonatoId: idCampeonato, rodada },
            include: [{ model: Time }],
            order: [['pontos', 'DESC'], ['vitorias', 'DESC']],
        }).then((partidas) => {
            res.render('admin/tabelas/index', {
                partidas, idCampeonato, rodada, campeonatos, rodadas, nomeCampeonato,
            });
        });
    }
    const qtdPartidas = await connection.query(`SELECT count(1) as qtd from tabelas WHERE campeonatoId = ${idCampeonato} AND rodada = ${rodada}`, { type: QueryTypes.SELECT });

    if (qtdPartidas[0].qtd !== 20) {
        const resultadosPartidas = await processarResultadosPartidas(idCampeonato, rodada);

        async function processarNovaTabela() {
            if (resultadosPartidas === true) {
                await processarResultadosTabela(idCampeonato, rodada);
                setTimeout(redirecionarTabela, 30000);
            }
        }

        setTimeout(processarNovaTabela, 5000);
    } else {
        redirecionarTabela();
    }
});

router.post('/tabela/campeonato', async (req, res) => {
    const { idCampeonato, rodada } = req.body;

    const campeonatos = await connection.query('SELECT * FROM campeonatos', { type: QueryTypes.SELECT });
    const rodadas = await connection.query(`SELECT rodada from partidas WHERE campeonatoId = ${campeonatos[0].id} GROUP By rodada`, { type: QueryTypes.SELECT });

    const campeonatosNomesRaw = await connection.query(
        `
        SELECT CONCAT(c.Campeonato, " - ", c.Divisao, " - ", c.Ano) as campeonato FROM campeonatos AS c
        WHERE c.id = ${idCampeonato}
        `,
        { type: QueryTypes.SELECT },
    );

    const nomeCampeonato = campeonatosNomesRaw[0].campeonato;

    Tabela.findAll({
        where: { campeonatoId: idCampeonato, rodada },
        include: [{ model: Time }],
        order: [['pontos', 'DESC'], ['vitorias', 'DESC']],
    }).then((partidas) => {
        res.render('admin/tabelas/index', {
            partidas, idCampeonato, rodada, campeonatos, rodadas, nomeCampeonato,
        });
    });
});

module.exports = router;
