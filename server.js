const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models");
const Role = db.role;
const Doctor = db.doctor;
const Appointment = db.appointment;

const app = express();

let corsOptions = {
  origin: ["https://medbook-vistacentro.netlify.app", "http://localhost:3000", "http://10.0.0.121:3000"]
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

require("./routes/auth.routes")(app);

require("./routes/user.routes")(app);

require("./routes/doctor.routes")(app);

require("./routes/appointment.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 5432;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

db.sequelize.sync().then(() => {
  console.log("Drop and Resync Db");

});




// const accountSid = "AC1947373f2ca9f65ba9639ba8a8225374"
// const authToken ="bc52e384a5d445a532bcb062a0db2c82";
// const client = require('twilio')(accountSid, authToken);
// const one = "Miercoles";
// const two = "12:00pm";
//
// client.messages
//     .create({
//       messagingServiceSid: 'MGf95103e4cda1035962adcfc275e47d7d',
//       contentSid: 'HX444e87f5b0fa719e7a4ac9bf9af8f0d3',
//       from: 'whatsapp:+18777310396',
//       contentVariables: JSON.stringify({
//         1: 'Miercoles',
//         2: '12:00pm'
//       }),
//       to: 'whatsapp:+584142462027'
//     })
//     .then(message => console.log(message.sid));