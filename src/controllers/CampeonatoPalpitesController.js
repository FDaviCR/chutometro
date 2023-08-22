/* eslint-disable max-len */
const express = require('express');
const { QueryTypes } = require('sequelize');
const connection = require('../database/database');

const router = express.Router();
// const bcrypt = require('bcryptjs');
const CampeonatoPaltipes = require('../models/CampeonatoPalpites');
const Campeonatos = require('../models/Campeonatos');
const Palpite = require('../models/Palpites');
const Tabela = require('../models/TabelaPalpites');

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

router.get('/campeonato-palpites/processar/:campeonato/:campeonatoPalpites/:rodada', async (req, res) => {
    const { campeonato, campeonatoPalpites, rodada } = req.params;

    async function processarPalpites() {
        const partidas = await connection.query(`
            SELECT r.* from partidas AS p
            INNER JOIN resultadospartidas AS r ON p.id = r.partidaId
            WHERE p.campeonatoId = ${campeonato} and p.rodada = ${rodada}
        `, { type: QueryTypes.SELECT });

        await partidas.forEach(async (partida) => {
            const palpites = await connection.query(`
                SELECT * FROM palpites WHERE partidaId = ${partida.partidaId} AND CampeonatoPalpiteId = ${campeonatoPalpites}
            `, { type: QueryTypes.SELECT });

            await palpites.forEach(async (palpite) => {
                await Palpite.update(
                    { valido: 0, resultado: 0 },
                    { where: { partidaId: partida.partidaId } },
                );

                if (palpite.palpite === partida.resultado) {
                    await Palpite.update(
                        { valido: 1, resultado: 1 },
                        { where: { partidaId: partida.partidaId, usuarioId: palpite.usuarioId } },
                    );
                } else {
                    await Palpite.update(
                        { valido: 1, resultado: 0 },
                        { where: { partidaId: partida.partidaId, usuarioId: palpite.usuarioId } },
                    );
                }
            });
        });
    }
    /** VERIFICAR SOMA DOS PONTOS POR RODADA */

    async function processarTabela() {
        const tabela = await connection.query(`
            select * from tabelapalpites
            WHERE CampeonatoPalpiteId = ${campeonatoPalpites}
        `, { type: QueryTypes.SELECT });

        await tabela.forEach(async (item) => {
            const pontos = await Palpite.sum(
                'resultado',
                { where: { CampeonatoPalpiteId: campeonatoPalpites, rodada, usuarioId: item.usuarioId } },
            );
            console.log(`==========${item.usuarioId}===${pontos}-------------------------------------`);
            const pts = parseInt(item.pontuacao, 10) + parseInt(pontos, 10);

            await Tabela.update(
                { pontuacao: pts, rodada },
                { where: { usuarioId: item.usuarioId, CampeonatoPalpiteId: item.CampeonatoPalpiteId } },
            );
        });
    }

    processarPalpites();
    setTimeout(processarTabela, 20000);

    CampeonatoPaltipes.findAll().then((campeonatos) => {
        res.render('admin/campeonatoPalpites/index', { campeonatos });
    });
});

module.exports = router;
