/* eslint-disable max-len */
const { QueryTypes } = require('sequelize');
// const ResultadosPartidas = require('../models/ResultadosPartidas');
const Tabela = require('../models/Tabelas');

const connection = require('../database/database');

async function criarDadosRodada(rodada, time, vitoria, derrota, empate, pontos, golsPro, golsContra, campeonato) {
    console.log('---------------------------------------------------------------------------------------------');
    console.log(`--------------------------------------${time}----------------------------------------------`);
    console.log('---------------------------------------------------------------------------------------------');
    if (rodada !== 1) {
        const registroAnterior = await connection.query(`
            SELECT * from tabelas
            WHERE campeonatoId = ${campeonato} AND timeId = ${time} AND rodada = (SELECT max(rodada) from tabelas
            WHERE campeonatoId = ${campeonato}  AND timeId = ${time})
        `, { type: QueryTypes.SELECT });

        await Tabela.create({
            pontos: registroAnterior.pontos + pontos,
            jogos: registroAnterior.jogos + 1,
            vitorias: registroAnterior.vitorias + vitoria,
            derrotas: registroAnterior.derrotas + derrota,
            empates: registroAnterior.empates + empate,
            porcentagem: 0,
            golsPro: registroAnterior.golsPro + golsPro,
            golsContra: registroAnterior.golsContra + golsContra,
            rodada,
            ativo: 1,
            campeonatoId: campeonato,
            timeId: time,
        });
    } else {
        await Tabela.create({
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
    await Tabela.destroy({
        where: { campeonatoId, rodada },
    });

    const partidasDaRodada = await connection.query(`
        SELECT * FROM partidas as p
        INNER JOIN resultadospartidas as rp ON p.id = rp.partidaId
        WHERE campeonatoId = ${campeonatoId} and Rodada = ${rodada}
    `, { type: QueryTypes.SELECT });

    async function criarRegistros(partidas) {
        partidas.forEach(async (partida) => {
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
    }

    criarRegistros(partidasDaRodada);
    return true;
}

module.exports = processarResultadosTabela;
