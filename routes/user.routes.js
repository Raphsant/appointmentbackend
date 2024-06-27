const {authJwt} = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Access-Control-Allow-Origin",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/test/all", authJwt.verifyToken, controller.allAccess);
    app.get("/api/user/getAll", authJwt.verifyToken, authJwt.isAdmin, controller.getAllUsers);
    app.get("/api/user/count", authJwt.verifyToken, authJwt.isAdmin, controller.userCount);
    // app.get("/api/test/user", authJwt.verifyToken, controller.userBoard);
    app.get("/api/user/profile", authJwt.verifyToken, controller.userBoard);
    app.get("/api/user/getUser", controller.getUser);
    app.post("/api/user/update", authJwt.verifyToken, controller.updateUser);
    app.post("/api/user/delete", authJwt.verifyToken, controller.deleteUser);
    app.post("/api/user/elevate", authJwt.verifyToken, authJwt.isAdmin, controller.elevateUser);


    // app.get(
    //   "/api/test/mod",
    //   [verifyToken, authJwt.isModerator],
    //   controller.moderatorBoard
    // );
    //
    // app.get(
    //   "/api/test/admin",
    //   [verifyToken, authJwt.isAdmin],
    //   controller.adminBoard
    // );
};
