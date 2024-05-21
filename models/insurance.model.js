const { DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const Insurance = sequelize.define("insurances", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        },
    });

    return Insurance;
};