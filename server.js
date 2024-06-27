const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models");
const seguros = require("./data/insurances.json");
const Role = db.role;
const Doctor = db.doctor;
const Appointment = db.appointment;
const user = db.user;
const Insurance = db.insurance;

const app = express();

let corsOptions = {
    origin:  ["http://localhost:3000", "http://10.0.0.121:3000", "https://vistacentro-citas.com", "https://seguros.vistacentro-citas.com"]
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// simple route
app.get("/", (req, res) => {
    res.json({message: "hello world"});
});

require("./routes/auth.routes")(app);

require("./routes/user.routes")(app);

require("./routes/doctor.routes")(app);

require("./routes/appointment.routes")(app);

require("./routes/insurance.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);

});

db.sequelize.sync().then(async () => {
    console.log("Drop and Resync Db");
});


//