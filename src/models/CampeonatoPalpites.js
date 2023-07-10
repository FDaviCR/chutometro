const Sequelize = require('sequelize');
const connection = require('../database/database');

const Campeonato = require('./Campeonatos');

const CampeonatoPalpites = connection.define('CampeonatoPalpites', {
    apelido: {
        type: Sequelize.STRING,
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

CampeonatoPalpites.belongsTo(Campeonato);

CampeonatoPalpites.sync({ force: false });

module.exports = CampeonatoPalpites;
