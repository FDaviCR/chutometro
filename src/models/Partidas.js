const Sequelize = require('sequelize');
const connection = require('../database/database');

const Time = require('./Times');
const Campeonato = require('./Campeonatos');

const Partida = connection.define('partidas', {
    numeroPartida: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    local: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    data: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    golsMandante: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    golsVisitante: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    cartoesAmarelosMandante: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    cartoesAmarelosVisitante: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    cartoesVermelhosMandante: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    cartoesVermelhosVisitante: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    partidaRealizada: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
}, {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

Partida.belongsTo(Campeonato);
Partida.belongsTo(Time, {
    foreignKey: 'mandanteId',
});

Partida.belongsTo(Time, {
    foreignKey: 'visitanteId',
});

Partida.sync({ force: false });

module.exports = Partida;
