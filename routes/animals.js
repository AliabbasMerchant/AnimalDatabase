const express = require("express");
const mysql = require('mysql');
const constants = require('../constants');
const secrets = require('../secrets');
const multer = require('multer');
const fs = require('fs');

const upload = multer();

var router = express.Router({ mergeParams: true });

const con = mysql.createConnection({
    host: secrets.sql_host,
    user: secrets.sql_user,
    password: secrets.sql_password,
    database: constants.db
});

router.get("/find", (req, res) => {
    res.render("animals/find");
});

router.get("/all", (req, res) => {
    con.query(`SELECT * FROM ${constants.animals_table}`, (err, result) => {
        res.render("animals/results",{result});
    });
});

router.get("/add", (req, res) => {
    res.render("animals/add");
});

router.post("/add", upload.single("file"), (req, res) => {
    const { name, dob, status, gender, description, photo, animal_species, location } = req.body;
    console.log(req.body);
    let loc = String(location).split(' '); // This is giving some error
    let errors = [];
    if (!name, !dob, !gender, !photo, !animal_species)
        errors.push('Please fill in all required fields');
    if (req.file)
        if (req.file.size > 2000 * 1000)
            errors.push('Cannot upload files greater than 2 MB');
    if (errors.length > 0)
        res.render("animals/add", { errors, name, dob, status, gender, description, photo, animal_species, location });
    else {
        let photo = '';
        if (req.file)
            photo = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        let sql = `INSERT INTO ${constants.animals_table} 
                    (
                        name, dob, status, gender, description, photo, animal_species, location
                    ) 
                    VALUES 
                    (
                        ?, ?, ?, ?, ?, ?, ?, POINT(?, ?)
                    )`;
        // TODO Insert statement
        // Be sure that if something is empty, we put in NULL, and not 
        //Consider here animal_id also while passing;
        //Consider the loc array for latitude and longitude
        con.query(sql, [name, dob, status, gender, description, photo, animal_species, loc[0], loc[1]], function (err, result) {
            if (err) console.log(err);
            else {
                // req.flash('success_msgs', 'Animal added.');
                res.redirect('/admin');
            }
        });
    }
});
module.exports = router;
