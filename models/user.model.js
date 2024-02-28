const {DataTypes} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
            allowNull: false,
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        },
        firstName:{
          type: Sequelize.STRING,
            allowNull: false,
        },
        lastName:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    });

    return User;
};