const {Op, transaction} = require("sequelize");
const db = require("../models");
const Doctor = db.doctor;
const User = db.user;
const Appointment = db.appointment;
async function createAppointment(doctorId, dateTime, userId) {
    try {
        return await db.sequelize.transaction(async() => {
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
    createAppointment,
    getAppointment,
    updateAppointment,
    deleteAppointment,
    getAllDoctorsAppointments,
    getAllUserAppointments,
    changeAptStatus,
    getAppointmentsInRange
};
