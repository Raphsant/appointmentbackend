const controller = require("../controllers/doctor.controller");
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

    app.post("/api/doctor/create", authJwt.verifyToken, controller.createDoctor);
    app.post("/api/doctor/edit", authJwt.verifyToken, controller.editDoctor);
    app.post("/api/doctor/delete", authJwt.verifyToken, controller.deleteDoctor);
    app.get("/api/doctor", authJwt.verifyToken, controller.getAllDoctors);
    app.get("/api/getDoctor", authJwt.verifyToken, controller.getDoctor);
    app.get("/api/doctor/count", authJwt.verifyToken, controller.doctorCount)
    app.get("/api/doctor/specialty", controller.getDoctorBySpecialty)
};


