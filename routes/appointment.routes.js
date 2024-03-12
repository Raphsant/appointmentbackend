const controller = require("../controllers/appointment.controller");
const {authJwt} = require("../middleware");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/apts/create",
        authJwt.verifyToken,
        controller.createAppointment
    );
    app.post("/api/apts/edit", authJwt.verifyToken, controller.updateAppointment);
    app.post(
        "/api/apts/delete",
        authJwt.verifyToken,
        controller.deleteAppointment
    );
    app.post("/api/apts/apt", authJwt.verifyToken, controller.getAppointment);
    app.get("/api/apts/getDoctorApts", authJwt.verifyToken, controller.getDoctorAppointments);
    app.get("/api/apts/getUserApts", authJwt.verifyToken, controller.getUserAppointments);
    app.get("/api/apts/getAllApts", authJwt.verifyToken, controller.getAllAppointments);
    app.get("/api/apts/count", authJwt.verifyToken, controller.appointmentCount);
    app.post("/api/apts/confirm", authJwt.verifyToken, controller.changeAptStatus)
};


