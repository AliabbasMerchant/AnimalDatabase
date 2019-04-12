const express = require("express");
const mysql = require('mysql');
const constants = require('../constants');
const secrets = require('../secrets');

var router = express.Router();

const con = mysql.createConnection({
    host: secrets.sql_host,
    user: secrets.sql_user,
    password: secrets.sql_password,
    database: constants.db
});

router.get("/find", (req, res) => {
    res.render("animal_species/find");
});

router.get("/all", (req, res) => {
    con.query(`SELECT * FROM ${constants.animal_species_table}`, (err, result) => {
        res.send(result);
    });
});

router.get("/add", (req, res) => {
    res.render("animal_species/add");
});

router.post("/add", (req, res) => {
    const { animal_species, common_name, description, _genus, _order, _class, _phylum, _status } = req.body;
    console.log(req.body);
    let errors = [];
    if (!animal_species, !common_name, !_genus, !_order, !_class, !_phylum)
        errors.push('Please fill in all required fields');
    // FOR PHOTO, use multer @Ali will do it wherever required
    // if (req.file) 
    //     if (req.file.size > 2000 * 1000)
    //         errors.push('Cannot upload files greater than 2 MB');
    if (errors.length > 0)
        res.render("animal_species/add", { errors, animal_species, common_name, description, _genus, _order, _class, _phylum, _status });
    else {
        let sql = ``;
        // TODO Insert statement
        // Be sure that if something is empty, we put in NULL, and not 
        con.query('', function (err, result) {
            if (err) console.log(err);
            else {
                req.flash('success_msgs', 'Animal Species added.');
                res.redirect('/admin');
            }
        });
    }
});


module.exports = router;
