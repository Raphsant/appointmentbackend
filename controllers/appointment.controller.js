const appointmentService = require("../services/appointment.service");

exports.createAppointment = async (req, res) => {
    try {
        console.log(req.body)
        const doctorId = req.body.doctorId;
        const dateTime = new Date(req.body.dateTime);
        const userId = req.body.userId;
        const newAppointment = await appointmentService.createAppointment(
            doctorId,
            dateTime,
            userId
        );
        res.status(201).json(newAppointment);
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