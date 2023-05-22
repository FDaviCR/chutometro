const Sequelize = require("sequelize");
const connection = require("../database/database");

const Usuario = connection.define('usuarios',{
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    usuario:{
        type: Sequelize.STRING,
        allowNull: false
    },
    ativo:{
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
})

Usuario.sync({force:false});

module.exports = Usuario;
