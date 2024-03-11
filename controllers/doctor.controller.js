const db = require("../models");
const Doctor = db.doctor;

exports.createDoctor = async (req, res) => {
  /*
      Creates the Doctor in the database
       */
  try {
    await Doctor.create({
      id: req.body.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      specialty: req.body.specialty,
      schedule: req.body.schedule,
    });
    await res.status(200).send("success");
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: e.message });
  }
};

exports.editDoctor = async (req, res) => {
  try {
    const targetDoctor = await Doctor.findByPk(req.body.id);
    await targetDoctor.set({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      specialty: req.body.specialty,
    });
    await targetDoctor.save();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: e.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const targetDoctor = await Doctor.findByPk(req.body.id);
    await targetDoctor.destroy();
    await res.status(200).send("success, doctor deleted");
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: e.message });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    await res.status(200).send(doctors);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: e.message });
  }
};

exports.getDoctor = async (req, res) => {
  try {
    // console.log(req.query)
    const doctor = await Doctor.findByPk(req.query.id);
    if (!doctor) throw new Error("No doctor found");
    await res.status(200).send(doctor);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

exports.doctorCount = async (req,res) => {
  try{
    const count = await Doctor.count()
    res.status(200).json(count)
  }catch (e) {
    res.status(400).json({message: e.message})
  }
}