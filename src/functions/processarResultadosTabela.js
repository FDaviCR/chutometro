/* eslint-disable max-len */
const { QueryTypes } = require('sequelize');
// const ResultadosPartidas = require('../models/ResultadosPartidas');
const Tabela = require('../models/Tabelas');

const connection = require('../database/database');

async function criarDadosRodada(rodada, time, vitoria, derrota, empate, pontos, golsPro, golsContra, campeonato) {
    if (rodada !== 1) {
        // Do nothing
        /*
        const registroAnterior = await connection.query(`
            SELECT * FROM partidas as p
            INNER JOIN resultadospartidas as rp ON p.id = rp.partidaId
            WHERE campeonatoId = ${campeonato} and Rodada = ${rodada}
        `, { type: QueryTypes.SELECT });

        Tabela.create({
            pontos,
            jogos: 1,
            vitorias: 1,
            derrotas: 0,
            empates: 0,
            porcentagem: 100,
            golsPro,
            golsContra,
            rodada,
            ativo: 1,
            campeonatoId: campeonato,
            timeId: time,
        });
        */
    } else {
        // console.log(`Partida: ${time}`);
        Tabela.create({
            pontos,
            jogos: 1,
            vitorias: vitoria,
            derrotas: derrota,
            empates: empate,
            porcentagem: 0,
            golsPro,
            golsContra,
            rodada,
            ativo: 1,
            campeonatoId: campeonato,
            timeId: time,
        });
    }
}

async function processarResultadosTabela(campeonatoId, rodada) {
    const partidas = await connection.query(`
        SELECT * FROM partidas as p
        INNER JOIN resultadospartidas as rp ON p.id = rp.partidaId
        WHERE campeonatoId = ${campeonatoId} and Rodada = ${rodada}
    `, { type: QueryTypes.SELECT });

    await partidas.forEach(async (partida) => {
        if (partida.resultado === partida.mandanteId) {
            await criarDadosRodada(partida.Rodada, partida.mandanteId, 1, 0, 0, 3, partida.golsMandante, partida.golsVisitante, campeonatoId);
            await criarDadosRodada(partida.Rodada, partida.visitanteId, 0, 1, 0, 0, partida.golsVisitante, partida.golsMandante, campeonatoId);
        } else if (partida.resultado === partida.visitanteId) {
            await criarDadosRodada(partida.Rodada, partida.visitanteId, 1, 0, 0, 3, partida.golsVisitante, partida.golsMandante, campeonatoId);
            await criarDadosRodada(partida.Rodada, partida.mandanteId, 0, 1, 0, 0, partida.golsMandante, partida.golsVisitante, campeonatoId);
        } else {
            await criarDadosRodada(partida.Rodada, partida.mandanteId, 0, 0, 1, 1, partida.golsMandante, partida.golsVisitante, campeonatoId);
            await criarDadosRodada(partida.Rodada, partida.visitanteId, 0, 0, 1, 1, partida.golsVisitante, partida.golsMandante, campeonatoId);
        }
    });

    return true;
}

module.exports = processarResultadosTabela;
