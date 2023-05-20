const Sequelize = require("sequelize");
const connection = require("../database/database");

const User = connection.define('usuarios',{
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

User.sync({force:false});

module.exports = User;
