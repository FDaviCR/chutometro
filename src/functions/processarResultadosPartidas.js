/* eslint-disable max-len */
const Partidas = require('../models/Partidas');
const ResultadosPartidas = require('../models/ResultadosPartidas');

async function processarResultadosPartidas(campeonatoId, rodada) {
    Partidas.findAll({ where: { campeonatoId, Rodada: rodada, partidaRealizada: true } }).then((partida) => {
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
