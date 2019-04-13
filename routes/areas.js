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
    res.render("areas/find");
});

router.get("/all", (req, res) => {
    con.query(`SELECT * FROM ${constants.area_table}`, (err, result) => {
        res.send(result);
    });
});

router.get("/add", (req, res) => {
    res.render("areas/add");
});

router.post("/add", (req, res) => {
    const { name, boundary } = req.body;
    console.log(req.body);
    let errors = [];
    // let polygon = boundary.split(' ');
    if (!name, !boundary)
        errors.push('Please fill in all required fields');
    if (errors.length > 0)
        res.render("areas/add", { errors, name, boundary });
    else {
        let sql = ``;
        // TODO Insert statement
        // Be sure that if something is empty, we put in NULL, and not 
        // Consider the polygon for boundary points
        con.query('', function (err, result) {
            if (err) console.log(err);       
            else {
                req.flash('success_msgs', 'Areas added.');
                res.redirect('/admin');
            }
        });
    }
});

module.exports = router;
