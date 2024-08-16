const appointmentService = require("../services/appointment.service");
const {authJwt} = require("../middleware");
const db = require("../models");
const res = require("express/lib/response");
const Appointment = db.appointment;
const User = db.user
const Doctor = db.doctor
const accountSid = process.env.ACCOUNTSID
const authToken = process.env.AUTHTOKEN
const client = require('twilio')(accountSid, authToken);

function formatDateAndTimeForMsg(dateTimeString) {
    const date = new Date(dateTimeString);

    // Options for formatting the date in Spanish
    const dateOptions = {weekday: 'long', day: 'numeric', month: 'long'};
    const timeOptions = {hour: 'numeric', minute: 'numeric', hour12: true};

    // Formatters
    const dateFormatter = new Intl.DateTimeFormat('es-ES', dateOptions);
    const timeFormatter = new Intl.DateTimeFormat('es-ES', timeOptions);

    // Formatting the date and time
    const formattedDate = dateFormatter.format(date);
    const formattedTime = timeFormatter.format(date);

    return [formattedDate, formattedTime];
}

function sendAppointmentCreatedMessage(dateAndTime, phone) {
    try {
        const [date, time] = formatDateAndTimeForMsg(dateAndTime)
        client.messages
            .create({
                messagingServiceSid: 'MGf95103e4cda1035962adcfc275e47d7d',
                contentSid: 'HX444e87f5b0fa719e7a4ac9bf9af8f0d3',
                from: 'whatsapp:+18777310396',
                contentVariables: JSON.stringify({
                    1: date,
                    2: time,
                }),
                to: `whatsapp:${phone}`
            })
            .then(message => console.log(message?.sid));
    } catch (e) {
        console.error(e.message)
    }
}

async function isUserAdmin(req, roles) {
    const triggerUser = await User.findByPk(req.userId)
    const triggerUserRoles = await triggerUser.getRoles();
    return triggerUserRoles.some(role => roles.includes(role.name))
}


/**
 * Middleware to handle errors
 * @param {*} error
 * @param {*} response
 */
function handleError(error, response) {
    console.error(error.message);
    const status = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    response.status(status).json({message});
}

/**
 * Checks if the user is allowed to make the requested changes
 * @param {*} request
 */
async function checkPrivileges(request) {
    const {userId, body} = request;
    console.log("DEBUG")
    console.log(userId)
    if (userId !== body.userId && await isUserAdmin(request, ['admin, moderator']) === false) {
        throw new Error('You are making an appointment for someone else and you are not an admin.');
    }
}

exports.createAppointment = async (request, response) => {
    try {
        await checkPrivileges(request);

        // Destructuring request body
        const {doctorId, userId, dateTime: dateTimeString} = request.body;
        const dateTime = new Date(dateTimeString);
        const localDate = dateTime.toLocaleString('en-US', {timeZone: "America/Caracas"});
        const isConfirmed = false
        const targetUser = await User.findByPk(userId)
        const newAppointment = await appointmentService.createAppointment(
            doctorId,
            dateTime,
            userId,
            isConfirmed
        );
        sendAppointmentCreatedMessage(localDate, targetUser.phone)
        response.status(201).json(newAppointment);
    } catch (e) {
        handleError(e, response);
    }
};
exports.getAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const appointment = await appointmentService.getAppointment(appointmentId);
        res.status(200).json(appointment);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
};

exports.updateAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const doctorId = req.body.doctorId;
        const dateTime = new Date(req.body.dateTime);

        const updatedAppointment = await appointmentService.updateAppointment(
            appointmentId,
            doctorId,
            dateTime
        );
        res.status(200).json(updatedAppointment);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        await appointmentService.deleteAppointment(appointmentId);
        res.status(200).json({message: "Appointment deleted successfully"});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

exports.getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.query.doctorId;
        console.log(doctorId)
        const appointments = await appointmentService.getAllDoctorsAppointments(doctorId);
        res.status(200).json(appointments)
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

exports.getUserAppointments = async (req, res) => {
    try {
        const userId = req.query.userId;
        const appointments = await appointmentService.getAllUserAppointments(userId);
        res.status(200).json(appointments)
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

exports.getAllAppointments = async (req, res) => {
    try {
        const appointmentList = await Appointment.findAll({
            include: [
                {
                    model: User,
                    required: true,
                    attributes: ['firstName', 'lastName', 'email', 'id', 'phone']
                },
                {
                    model: Doctor,
                    required: true,
                    attributes: ['firstName', 'lastName', 'specialty']
                }

            ]

        });
        res.status(200).json(appointmentList);
    } catch (e) {
        res.status(400).json({message: e.message})
    }
}

exports.appointmentCount = async (req, res) => {
    try {
        const count = await Appointment.count()
        res.status(200).json(count)
    } catch (e) {
        res.status(400).json({message: e.message})
    }
}

exports.changeAptStatus = async (req, res) => {
    const {status, id} = req.body;
    try {
        const confirmation = await appointmentService.changeAptStatus(status, id);
        res.status(200).json(confirmation);
    } catch (e) {
        res.status(400).json({message: e.message});
    }
}

exports.generateReport = async (req, res) => {
    const {start, end} = req.query;
    try {
        const report = await appointmentService.getAppointmentsInRange(start, end)
        if (!report) res.status(400).json({message: "Something went wrong, try again later!"})
        res.status(200).json(report);
    } catch (e) {
        res.status(400).json({message: e.message})
    }
}

exports.entityAppointment = async (req, res) => {
    const {user, dateTime, doctorId, isNew, insurance} = req.body;
    console.log(req.body)
    try {
        const apt = await appointmentService.createAppointmentEntitySystem(doctorId, dateTime, user, res, isNew, insurance)
        if (!apt) res.status(400).json({message: "Something went wrong, try again later!"})
        res.status(200).json({message: "Success!", apt: apt})
    } catch (e) {
        res.status(400).json({message: e.message})
    }
}