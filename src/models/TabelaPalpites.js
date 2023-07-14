const Sequelize = require('sequelize');
const connection = require('../database/database');

const CampeonatoPalpite = require('./CampeonatoPalpites');
const Usuario = require('./Usuarios');

const TabelaPalpites = connection.define('TabelaPalpites', {
    pontuacao: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
    },
    rodada: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
    },
    ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: true,
    },
}, {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

TabelaPalpites.belongsTo(CampeonatoPalpite);
TabelaPalpites.belongsTo(Usuario);

TabelaPalpites.sync({ force: false });

module.exports = TabelaPalpites;
