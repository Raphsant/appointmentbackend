const appointmentService = require("../services/appointment.service");
const db = require("../models");
const Appointment = db.appointment;
const User = db.user
const Doctor = db.doctor
const accountSid = process.env.ACCOUNTSID
const authToken = process.env.AUTHTOKEN
const client = require('twilio')(accountSid, authToken);
function formatDateAndTimeForMsg(dateTimeString) {
    const date = new Date(dateTimeString);

    // Options for formatting the date in Spanish
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };

    // Formatters
    const dateFormatter = new Intl.DateTimeFormat('es-ES', dateOptions);
    const timeFormatter = new Intl.DateTimeFormat('es-ES', timeOptions);

    // Formatting the date and time
    const formattedDate = dateFormatter.format(date);
    const formattedTime = timeFormatter.format(date);

    return [formattedDate, formattedTime];
}
function sendAppointmentCreatedMessage(dateAndTime, phone){
    const [date,time] = formatDateAndTimeForMsg(dateAndTime)
    client.messages
        .create({
            messagingServiceSid: 'MGf95103e4cda1035962adcfc275e47d7d',
            contentSid: 'HX444e87f5b0fa719e7a4ac9bf9af8f0d3',
            from: 'whatsapp:+18777310396',
            contentVariables: JSON.stringify({
                1: date,
                2: time,
            }),
            to:  `whatsapp:${phone}`
        })
        .then(message => console.log(message.sid));
}

exports.createAppointment = async (req, res) => {
    try {
        console.log(req.body)
        const doctorId = req.body.doctorId;
        const dateTime = new Date(req.body.dateTime);
        const userId = req.body.userId;
        const isConfirmed = false
        const newAppointment = await appointmentService.createAppointment(
            doctorId,
            dateTime,
            userId,
            isConfirmed
        );
        res.status(201).json(newAppointment);
        sendAppointmentCreatedMessage(dateTime, "+18152950339")

    } catch (e) {
        res.status(400).json({message: e.message});
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
                    attributes: ['firstName', 'lastName', 'email', 'id']
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

exports.appointmentCount = async (req,res) => {
    try{
        const count = await Appointment.count()
        res.status(200).json(count)
    }catch (e) {
        res.status(400).json({message: e.message})
    }
}

exports.changeAptStatus = async (req,res) => {
    try{
        console.log(req.body.status)
        console.log(req.body.id)
        const confirmation = await appointmentService.changeAptStatus(req.body.status, req.body.id)
        res.status(200).json(confirmation)
    }catch (e) {
        res.status(400).json({message: e.message})
    }
}