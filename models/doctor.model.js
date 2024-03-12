const {DataTypes} = require("sequelize");
const specs = require("../data/specialties");
module.exports = (sequelize, Sequelize) => {
    const Doctor = sequelize.define("doctors", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,

        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        specialty: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        schedule: {
            type: Sequelize.JSONB,
            allowNull: false,
        },
    });

    return Doctor;
};
