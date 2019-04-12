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


module.exports = router;