const express = require('express');
const { QueryTypes } = require('sequelize');
const connection = require('../database/database');

const router = express.Router();
// const bcrypt = require('bcryptjs');
// const Palpites = require('../models/Palpites');

router.get('/palpites', async (req, res) => {
    const campeonatos = await connection.query('SELECT * FROM campeonatos', { type: QueryTypes.SELECT });
    const rodadas = await connection.query(`SELECT rodada from partidas WHERE campeonatoId = ${campeonatos[0].id} GROUP By rodada`, { type: QueryTypes.SELECT });

    res.render('admin/palpites/index', { campeonatos, rodadas });
});

module.exports = router;
