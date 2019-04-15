const express = require("express");
const mysql = require('mysql');
const constants = require('../constants');
const secrets = require('../secrets');

var router = express.Router();
var plant_id = 0;

const con = mysql.createConnection({
    host: secrets.sql_host,
    user: secrets.sql_user,
    password: secrets.sql_password,
    database: constants.db
});

router.get("/find", (req, res) => {
    res.render("plants/find");
});

router.get("/all", (req, res) => {
    con.query(`SELECT * FROM ${constants.plants_table}`, (err, result) => {
        res.send(result);
    });
});

router.get("/add", (req, res) => {
    res.render("plants/add");
});

router.post("/add", (req, res) => {
    // plant_id += 1; I think not needed
    const { description, number, status, photo, plant_species, location } = req.body;
    console.log(req.body);
    let errors = [];
    // let loc = location.split(' '); Not working !!!!!
    if (!number, !photo, !plant_species, !location)
        errors.push('Please fill in all required fields');
    // FOR PHOTO, use multer @Ali will do it wherever required
    // if (req.file) 
    //     if (req.file.size > 2000 * 1000)
    //         errors.push('Cannot upload files greater than 2 MB');
    if (errors.length > 0)
        res.render("plants/add", { errors, description, number, status, photo, plant_species, location });
    else {
        let sql = `INSERT INTO ${constants.plants_table} 
                    (
                        description, number, status, photo, plant_species, location
                    ) 
                    VALUES 
                    (
                        ?, ?, ?, ?, ?, ?
                    )`;
        // TODO Insert statement
        // Be sure that if something is empty, we put in NULL, and not 
        //Consider plant_id while passing
        //Consider loc array for latitude and longitude
        con.query(sql, [description, number, status, photo, plant_species, location], function (err, result) {
            if (err) console.log(err);       
            else {
                // req.flash('success_msgs', 'Plant added.');
                res.redirect('/admin');
            }
        });
    }
});

module.exports = router;
