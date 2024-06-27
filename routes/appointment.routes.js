const controller = require("../controllers/appointment.controller");
const {authJwt} = require("../middleware");
const origen = ["http://localhost:3000", "http://10.0.0.121:3000", "https://vistacentro-citas.com", "https://seguros.vistacentro-citas.com/"]

module.exports = function (app) {
    app.use(function(req, res, next) {
        // Allow requests from any origin
        res.header("Access-Control-Allow-Origin", origin);

        // Allow specific headers for CORS requests
        res.header("Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept");

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
    app.get("/api/apts/getDoctorApts", controller.getDoctorAppointments);
    app.get("/api/apts/getUserApts", authJwt.verifyToken, controller.getUserAppointments);
    app.get("/api/apts/getAllApts", authJwt.verifyToken, controller.getAllAppointments);
    app.get("/api/apts/count", authJwt.verifyToken, controller.appointmentCount);
    app.post("/api/apts/confirm", authJwt.verifyToken, controller.changeAptStatus)
    app.get("/api/apts/report", authJwt.verifyToken, authJwt.isModeratorOrAdmin, controller.generateReport)
    app.post("/api/apts/entity/create", controller.entityAppointment)
};


