const User = require("./user.model");
module.exports = (sequelize, Sequelize) => {
    const Appointment = sequelize.define("appointments", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        dateTime: {
            type: Sequelize.DATE,
        },
        status: {
            type: Sequelize.ENUM,
            values: ['confirmada', 'en espera', 'cancelada'],
        },
        // Foreign key for the user
        userId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'users', // name of the users table
                key: 'id', // key in users to which we're referencing
            },
        },

        // Foreign key for the doctor
        doctorId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'doctors', // name of the doctors table
                key: 'id', // key in doctors to which we're referencing
            },
        },

    });

    return Appointment;
};
