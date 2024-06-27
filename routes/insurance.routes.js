const controller = require("../controllers/insurance.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Access-Control-Allow-Origin",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/insurances/all", controller.getAllInsurances)
}