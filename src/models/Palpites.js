const Sequelize = require('sequelize');
const connection = require('../database/database');

const Partida = require('./Partidas');
const Usuario = require('./Usuarios');
const Campeonato = require('./Campeonatos');
const CampeonatoPalpite = require('./CampeonatoPalpites');

const Palpite = connection.define('Palpites', {
    palpite: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    resultado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    rodada: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    valido: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
}, {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

Palpite.belongsTo(Partida);
Palpite.belongsTo(Usuario);
Palpite.belongsTo(Campeonato);
Palpite.belongsTo(CampeonatoPalpite);

Palpite.sync({ force: false });

module.exports = Palpite;
