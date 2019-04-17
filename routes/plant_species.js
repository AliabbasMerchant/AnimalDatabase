const express = require("express");
const mysql = require('mysql');
const constants = require('../constants');
const secrets = require('../secrets');

var router = express.Router({ mergeParams: true });

const con = mysql.createConnection({
    host: secrets.sql_host,
    user: secrets.sql_user,
    password: secrets.sql_password,
    database: constants.db
});

router.get("/find", (req, res) => {
    res.render("plant_species/find");
});

router.get("/all", (req, res) => {
    con.query(`SELECT * FROM ${constants.plant_species_table}`, (err, result) => {
        res.render("plant_species/results",{result});
    });
});

router.get("/add", (req, res) => {
    res.render("plant_species/add");
});

router.post("/add", (req, res) => {
    const { plant_species, common_name, description, _genus, _order, _class, _phylum, _status } = req.body;
    console.log(req.body);
    let errors = [];
    if (!plant_species, !common_name, !_genus, !_order, !_class, !_phylum)
        errors.push('Please fill in all required fields');
    if (errors.length > 0)
        res.render("plant_species/add", { errors, plant_species, common_name, description, _genus, _order, _class, _phylum, _status });
    else {
        let sql = `INSERT INTO ${constants.plant_species_table} 
                    (
                        plant_species, common_name, description, _genus, _order, _class, _phylum, _status
                    ) 
                    VALUES 
                    (
                        ?, ?, ?, ?, ?, ?, ?, ?
                    )`;
        // TODO Insert statement
        // Be sure that if something is empty, we put in NULL, and not 
        con.query(sql, [plant_species, common_name, description, _genus, _order, _class, _phylum, _status], function (err, result) {
            if (err) console.log(err);       
            else {
                // req.flash('success_msgs', 'Plant Species added.');
                res.redirect('/admin');
            }
        });
    }
});

module.exports = router;
