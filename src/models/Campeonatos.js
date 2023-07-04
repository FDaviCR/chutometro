const Sequelize = require('sequelize');
const connection = require('../database/database');

const Campeonato = connection.define('campeonatos', {
    Campeonato: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Divisao: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    Ano: {
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

Campeonato.sync({ force: false });

module.exports = Campeonato;
