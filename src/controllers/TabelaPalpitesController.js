const express = require('express');
const { QueryTypes } = require('sequelize');
const connection = require('../database/database');

const router = express.Router();
// const bcrypt = require('bcryptjs');
const Usuarios = require('../models/Usuarios');
const TabelaPalpites = require('../models/TabelaPalpites');

/** ROTAS DE RENDERIZAÇÃO DE PÁGINAS */
router.post('/tabela-palpites', async (req, res) => {
    const { idCampeonato } = req.body;

    if (idCampeonato !== undefined) {
        if (!Number.isNaN(idCampeonato)) {
            const campeonatos = await connection.query(
`
                SELECT tp.id, u.usuario, tp.pontuacao FROM tabelapalpites as tp
                INNER JOIN usuarios AS u ON u.id = tp.usuarioId
                INNER JOIN campeonatopalpites AS cp ON cp.id = tp.CampeonatoPalpiteId
                WHERE tp.CampeonatoPalpiteId = ${idCampeonato}
                ORDER BY tp.pontuacao`,
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

router.post('/tabela-palpites/add-user', (req, res) => {
    const { idCampeonato } = req.body;

    Usuarios.findAll().then((usuarios) => {
        res.render('admin/tabelaPalpites/create', { usuarios, idCampeonato });
    });
});

/** FUNÇÕES DE PROCESSAMENTO DE DADOS */
router.post('/tabela-palpites/create', async (req, res) => {
    const CampeonatoPalpiteId = req.body.campeonatoId;
    const { usuarioId } = req.body;

    const tabPalpite = await connection.query(
        `
        SELECT * FROM tabelapalpites as tp
        WHERE tp.CampeonatoPalpiteId = ${CampeonatoPalpiteId} and tp.usuarioId = ${usuarioId}`,
        { type: QueryTypes.SELECT },
    );

    if (tabPalpite === undefined || tabPalpite === null || tabPalpite.length === 0) {
        TabelaPalpites.create({
            usuarioId,
            CampeonatoPalpiteId,
            rodada: 0,
            pontuacao: 0,
            ativo: true,
        }).then(async () => {
            const campeonatos = await connection.query(
            `
                SELECT tp.id, u.usuario, tp.pontuacao FROM tabelapalpites as tp
                INNER JOIN usuarios AS u ON u.id = tp.usuarioId
                INNER JOIN campeonatopalpites AS cp ON cp.id = tp.CampeonatoPalpiteId
                WHERE tp.CampeonatoPalpiteId = ${CampeonatoPalpiteId}
                ORDER BY tp.pontuacao`,
                { type: QueryTypes.SELECT },
            );

            res.render('admin/tabelaPalpites/index', { campeonatos, idCampeonato: CampeonatoPalpiteId });
        }).catch((err) => {
            console.log(err);
        });
    } else {
        res.redirect('/campeonato-palpites');
    }
});

module.exports = router;
