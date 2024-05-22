const db = require("../models");
const e = require("express");
const {Op} = require("sequelize");
const db = require("../models");
const res = require("express/lib/response");
const Insurance = db.insurance


exports.getAllInsurances = async (req, res) => {
    try {
        const insurances = await Insurance.findAll();
        res.status(200).json(insurances);
    } catch (e) {
        res.status(400).send(e.message)
        console.error()
    }
}