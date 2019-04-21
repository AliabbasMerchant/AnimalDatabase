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
    res.render("animal_species/find");
});

router.post("/find", (req, res) => {
    let where_clause = '';
    for (var property in req.body) {
        if (req.body.hasOwnProperty(property)) {
            if(req.body[property] != '' && property!='sort' && property!= 'limit' && property!= 'skip') {
                if(where_clause == '') {
                    where_clause = 'WHERE ';
                }
                where_clause += `${property}="${req.body[property]}" AND `;
            }
        }
    }
    where_clause = where_clause.slice(0, -5);
    let sql = `SELECT * FROM ${constants.animal_species_table} ${where_clause} ORDER BY ${req.body.sort} LIMIT ${req.body.limit} OFFSET ${req.body.skip};`;
    console.log(sql);
    con.query(sql, (err, result) => {
        if(err) console.log(err);
        else res.render("animal_species/results", { result });
    });
});

router.get("/all", (req, res) => {
    con.query(`SELECT * FROM ${constants.animal_species_table};`, (err, result) => {
        if(err) console.log(err);
        else res.render("animal_species/results", { result });
    });
});

router.get("/add", (req, res) => {
    res.render("animal_species/add");
});

router.post("/add", (req, res) => {
    const { animal_species, common_name, description, _genus, _order, _class, _phylum, _status } = req.body;
    console.log(req.body);
    // console.log(data.animal_species, data.common_name, data._genus);
    let errors = [];
    if (!animal_species, !common_name, !_genus, !_order, !_class, !_phylum)
        errors.push('Please fill in all required fields');
    if (errors.length > 0)
        res.render("animal_species/add", { errors, animal_species, common_name, description, _genus, _order, _class, _phylum, _status });
    else {
        let sql = `INSERT INTO ${constants.animal_species_table} 
                    (
                        animal_species, common_name, description, _genus, _order, _class, _phylum, _status
                    ) 
                    VALUES 
                    (
                        ?, ?, ?, ?, ?, ?, ?, ?
                    )`;
        // TODO Insert statement
        // Be sure that if something is empty, we put in NULL, and not 
        con.query(sql, [animal_species, common_name, description, _genus, _order, _class, _phylum, _status], function (err, result) {
            if (err) console.log(err);
            else {
                // req.flash('success_msgs', 'Animal Species added.');
                res.redirect('/animal_species/all');
            }
        });
    }
});

module.exports = router;
