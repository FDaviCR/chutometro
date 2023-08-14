/* eslint-disable radix */
/* eslint-disable max-len */
const { QueryTypes } = require('sequelize');
const ResultadosPartidas = require('../models/ResultadosPartidas');
const connection = require('../database/database');

async function processarResultadosPartidas(campeonatoId, rodada) {
    console.log('P1');
    const partidas = await connection.query(`
        SELECT * from partidas WHERE campeonatoId = ${campeonatoId} and rodada = ${rodada}
    `, { type: QueryTypes.SELECT });

    partidas.forEach(async (partida) => {
        await ResultadosPartidas.destroy({
            where: { partidaId: partida.id },
        });

        if (partida.golsMandante > partida.golsVisitante) {
            ResultadosPartidas.create({
                resultado: partida.mandanteId,
                partidaId: partida.id,
            });
        } else if (partida.golsVisitante > partida.golsMandante) {
            ResultadosPartidas.create({
                resultado: partida.visitanteId,
                partidaId: partida.id,
            });
        } else {
            ResultadosPartidas.create({
                resultado: 0,
                partidaId: partida.id,
            });
        }
    });

    return true;
}

module.exports = processarResultadosPartidas;
