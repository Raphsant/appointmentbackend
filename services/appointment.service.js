const {Op, transaction} = require("sequelize");
const db = require("../models");
const Doctor = db.doctor;
const User = db.user;
const Appointment = db.appointment;
const aptController = require("../controllers/auth.controller");
const bcrypt = require("bcryptjs");


/**
 * Creates an appointment in the system with the entity system
 *
 * @param {number} doctorId - The ID of the doctor.
 * @param {Date} dateTime - The date and time of the appointment.
 * @param {object} user - The user information.
 * @param {object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the appointment entity is created successfully.
 */

async function createAppointmentEntitySystem(doctorId, dateTime, user, res) {
    try {
        const {id, firstName, lastName, email, phone} = user
        let username = generateUserName(firstName, lastName);
        let existingUser = await User.findOne({
            where: {
                username: username
            }
        })
        if (existingUser) {
            let increment = 1;
            while (existingUser) {
                username = generateUserName(firstName, lastName, increment);
                existingUser = await User.findOne({
                    where: {username: username}
                });
                increment++;
            }
        }
        //Fake request to call the controller locally
        /**
         * Represents a fake request object.
         *
         * @property {object} body - The body of the request with the following properties:
         * @property {number} body.id - The ID of the user.
         * @property {string} body.username - The username of the user.
         * @property {string} body.firstName - The first name of the user.
         * @property {string} body.lastName - The last name of the user.
         * @property {string} body.phone - The phone number of the user.
         * @property {string} body.email - The email address of the user.
         * @property {string} body.password - The password of the user. It is generated by concatenating the first character of the first name with the last name.
         */
        let fakeRequest = {
            body: {
                id: id,
                username: username,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email,
                password: `${firstName.charAt(0)}${lastName}`
            }
        }
        aptController.signup(fakeRequest, res)
        // return await db.sequelize.transaction(async () => {
        //
        // })
    } catch (e) {
        console.error(e.message);
    }
}

function generateUserName(firstName, lastName, increment = 0) {
    const baseUsername = firstName.charAt(0) + lastName;
    return increment > 0 ? `${baseUsername}${increment}` : baseUsername;
}


async function createAppointment(doctorId, dateTime, userId) {
    try {
        return await db.sequelize.transaction(async () => {
            const doctor = await Doctor.findByPk(doctorId);
            const patient = await User.findByPk(userId);
            if (!doctor) throw new Error("doctor not found");
            const thirtyMinutes = 29 * 60 * 1000; // 30 minutes in milliseconds
            const startTime = new Date(new Date(dateTime).getTime() - thirtyMinutes);
            const endTime = new Date(new Date(dateTime).getTime() + thirtyMinutes);

            const existingAppointment = await Appointment.findOne({
                where: {
                    dateTime: {
                        [Op.between]: [startTime, endTime],
                    },
                    doctorId: {
                        [Op.eq]: doctorId
                    }
                },
            });

            console.log(existingAppointment);

            if (existingAppointment) {
                throw new Error("Doctor already has an appointment within 30 minutes of this time");
            }

            const newAppointment = await Appointment.create({
                dateTime,
                doctorId,
                userId,
                status: "en espera",
            });
            await patient.addAppointment(newAppointment);
            await doctor.addAppointment(newAppointment);

            return newAppointment;

        })
    } catch (e) {
        console.error(e.message); // Changed to log the error message instead of status
    }
}

async function getAppointment(appointmentId) {
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
        throw new Error("Appointment not found");
    }
    return appointment;
}

async function updateAppointment(appointmentId, doctorId, dateTime) {
    const appointment = await getAppointment(appointmentId);

    // Check if doctor exists
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
        throw new Error("Doctor not found");
    }

    // Check if doctor is available
    const existingAppointment = await Appointment.findOne({
        include: {
            model: Doctor,
            where: {id: doctorId},
            through: {attributes: []},
        },
        where: {
            dateTime: {
                [Op.eq]: dateTime,
            },
        },
    });

    if (existingAppointment) {
        throw new Error("Doctor is not available at this time");
    }

    await appointment.update({doctorId, dateTime});
    return appointment;
}

async function deleteAppointment(appointmentId) {
    const appointment = await getAppointment(appointmentId);
    await appointment.destroy();
}

async function getAllDoctorsAppointments(doctorId) {

    const appointments = await Appointment.findAll({
        where: {
            doctorId: {
                [Op.eq]: doctorId
            }
        }
    })

    console.log(appointments)
    if (appointments) {
        return appointments
    }
}

async function getAllUserAppointments(userId) {
    const appointments = await Appointment.findAll({
        where: {
            userId: {
                [Op.eq]: userId
            }
        }
    })

    console.log(appointments)
    if (appointments) {
        return appointments
    }
}

async function changeAptStatus(status, id) {
    const targetApt = await Appointment.findByPk(id)
    await targetApt.update({
        status: status,
    })

}

async function getAppointmentsInRange(startDate, endDate) {
    try {
        const appointments = await Appointment.findAll({
            where: {
                dateTime: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                }
            },
            include: [
                {
                    model: User,
                    required: true,
                    attributes: ['firstName', 'lastName', 'email', 'id']
                },
                {
                    model: Doctor,
                    required: true,
                    attributes: ['firstName', 'lastName', 'specialty']
                }

            ]
        });

        console.log(appointments); // Optional: to log the fetched appointments for verification
        return appointments;
    } catch (e) {
        console.error('Error fetching appointments:', e.message);
        return []; // Return an empty array in case of an error
    }
}


module.exports = {
    createAppointmentEntitySystem,
    createAppointment,
    getAppointment,
    updateAppointment,
    deleteAppointment,
    getAllDoctorsAppointments,
    getAllUserAppointments,
    changeAptStatus,
    getAppointmentsInRange
};
