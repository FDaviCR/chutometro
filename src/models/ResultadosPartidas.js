const Sequelize = require('sequelize');
const connection = require('../database/database');

const Partidas = require('./Partidas');

const ResultadosPartidas = connection.define('ResultadosPartidas', {
    resutado: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

ResultadosPartidas.belongsTo(Partidas);

ResultadosPartidas.sync({ force: false });

module.exports = ResultadosPartidas;
