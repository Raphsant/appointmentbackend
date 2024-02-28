const { DataTypes } = require("sequelize");
const specs = require("../data/specialties");
module.exports = (sequelize, Sequelize) => {
  const Doctor = sequelize.define("doctors", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
    specialty: {
      type: DataTypes.ENUM("Medicina Interna", "test2"),
    },
    schedule: {
      type: Sequelize.JSONB,
      allowNull: true,
    },
  });

  return Doctor;
};
