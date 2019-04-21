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
    con.query(`SELECT DISTINCT animal_species FROM ${constants.animals_table}`, (err, animal_species) => {
        if (err) console.log(err);
        else res.render("animals/find", { animal_species });
    });
});

router.post("/find", (req, res) => {
    let where_clause = '';
    for (var property in req.body) {
        if (req.body.hasOwnProperty(property)) {
            if (req.body[property] != '' && property != 'sort' && property != 'limit' && property != 'skip') {
                if (where_clause == '') {
                    where_clause = 'WHERE ';
                }
                where_clause += `${property}="${req.body[property]}" AND `;
            }
        }
    }
    where_clause = where_clause.slice(0, -5);
    let sql = `SELECT * FROM ${constants.animals_table} ${where_clause} ORDER BY ${req.body.sort} LIMIT ${req.body.limit} OFFSET ${req.body.skip};`;
    console.log(sql);
    con.query(sql, (err, result) => {
        if (err) console.log(err);
        else res.render("animals/results", { result });
    });
});

router.get("/all", (req, res) => {
    con.query(`SELECT * FROM ${constants.animals_table}`, (err, result) => {
        if (err) console.log(err);
        else res.render("animals/results", { result });
    });
});

router.get("/add", (req, res) => {
    con.query(`SELECT animal_species FROM ${constants.animal_species_table};`, (err, animal_species) => {
        if (err) console.log(err);
        else res.render("animals/add", { animal_species });
    });
});

router.post("/add", upload.single("file"), (req, res) => {
    const { name, dob, status, gender, description, animal_species, location } = req.body;
    console.log(req.body);
    let loc = String(location).split(' '); // This is giving some error
    let errors = [];
    if (!name, !dob, !gender, !animal_species)
        errors.push('Please fill in all required fields');
    if (req.file)
        if (req.file.size > 2000 * 1000)
            errors.push('Cannot upload files greater than 2 MB');
    if (errors.length > 0)
        res.render("animals/add", { errors, name, dob, status, gender, description, animal_species, location });
    else {
        let photo = '';
        if (req.file)
            photo = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        let sql = `INSERT INTO ${constants.animals_table} 
                    (
                        name, dob, status, gender, description, animal_species, location
                    ) 
                    VALUES 
                    (
                        ?, ?, ?, ?, ?, ?, POINT(?, ?)
                    )`;
        con.query(sql, [name, dob, status, gender, description, animal_species, loc[0], loc[1]], function (err, result) {
            if (err) console.log(err);
            else {
                // req.flash('success_msgs', 'Animal added.');
                res.redirect('back');
            }
        });
    }
});

module.exports = router;
