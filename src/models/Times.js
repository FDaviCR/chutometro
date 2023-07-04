const Sequelize = require('sequelize');
const connection = require('../database/database');

const Time = connection.define('times', {
    time: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    timeApelido: {
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

Time.sync({ force: false });

module.exports = Time;
