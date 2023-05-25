const Sequelize = require('sequelize');
const connection = require('../database/database');

const Campeonato = connection.define('campeonatos', {
    Campeonato: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Ano: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
});

Campeonato.sync({ force: false });

module.exports = Campeonato;
