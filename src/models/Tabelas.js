const Sequelize = require('sequelize');
const connection = require('../database/database');

const Campeonato = require('./Campeonatos');
const Time = require('./Times');

const Tabela = connection.define('tabelas', {
    colocacao: {
        type: Sequelize.INTEGER,
        allowNull: true,
        default: 0,
    },
    pontos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
    },
    jogos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
    },
    vitorias: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
    },
    empates: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
    },
    derrotas: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
    },
    porcentagem: {
        type: Sequelize.INTEGER,
        allowNull: true,
        default: 0,
    },
    golsPro: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
    },
    golsContra: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
    },
    rodada: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
}, {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

Tabela.belongsTo(Campeonato);
Tabela.belongsTo(Time);

Tabela.sync({ force: false });

module.exports = Tabela;
