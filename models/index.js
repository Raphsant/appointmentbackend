const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.doctor = require("../models/doctor.model.js")(sequelize, Sequelize);
db.appointment = require("../models/appointment.model")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});
db.user.belongsToMany(db.appointment, {
  through: "user_appointments",
  foreignKey: "userId",
  otherKey: "appointmentId",
});

db.doctor.belongsToMany(db.appointment, {
  through: "doctor_appointments",
});
db.appointment.belongsToMany(db.doctor, {
  through: "doctor_appointments",
});

db.user.belongsToMany(db.appointment, {
  through: "user_appointments",
});
db.appointment.belongsToMany(db.user, {
  through: "user_appointments",
});

// Define the relationships
db.user.hasMany(db.appointment, { foreignKey: 'userId' });
db.appointment.belongsTo(db.user, { foreignKey: 'userId' });

db.doctor.hasMany(db.appointment, { foreignKey: 'doctorId' });
db.appointment.belongsTo(db.doctor, { foreignKey: 'doctorId' });

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
