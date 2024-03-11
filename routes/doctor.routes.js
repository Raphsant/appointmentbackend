const controller = require("../controllers/doctor.controller");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/doctor/create", authJwt.verifyToken, controller.createDoctor);
  app.post("/api/doctor/edit", authJwt.verifyToken, controller.editDoctor);
  app.post("/api/doctor/delete", authJwt.verifyToken, controller.deleteDoctor);
  app.get("/api/doctor", authJwt.verifyToken, controller.getAllDoctors);
  app.get("/api/getDoctor", authJwt.verifyToken, controller.getDoctor);
  app.get("/api/doctor/count", authJwt.verifyToken, controller.doctorCount)
};


