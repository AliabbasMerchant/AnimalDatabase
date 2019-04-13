const express = require("express");
const mysql = require('mysql');
const constants = require('../constants');
const secrets = require('../secrets');

var router = express.Router();
var animal_id = 0;

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
        res.send(result);
    });
});

router.get("/add", (req, res) => {
    res.render("animals/add");
});

router.post("/add", (req, res) => {
    animal_id += 1;
    const { name, dob, status, gender, description, photo, animal_species, location } = req.body;
    console.log(req.body);
    // let loc = location.split(' ');
    let errors = [];
    if (!name, !dob, !gender, !photo, !animal_species)
        errors.push('Please fill in all required fields');
    // FOR PHOTO, use multer @Ali will do it wherever required
    // if (req.file) 
    //     if (req.file.size > 2000 * 1000)
    //         errors.push('Cannot upload files greater than 2 MB');
    if (errors.length > 0)
        res.render("animals/add", { errors, name, dob, status, gender, description, photo, animal_species, location });
    else {
        let sql = ``;
        // TODO Insert statement
        // Be sure that if something is empty, we put in NULL, and not 
        //Consider here animal_id also while passing;
        //Consider the loc array for latitude and longitude
        con.query('', function (err, result) {
            if (err) console.log(err);       
            else {
                req.flash('success_msgs', 'Animal added.');
                res.redirect('/admin');
            }
        });
    }
});
module.exports = router;
