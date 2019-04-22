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

router.get("/show/:plant_species", (req, res) => {
    con.query(`SELECT * FROM ${constants.plant_species_table} WHERE plant_species="${req.params.plant_species}"`, (err, plant_species) => {
        if (err) console.log(err);
        else res.render("plant_species/show", { species: plant_species[0] });
    });
});

router.get("/edit/:plant_species", (req, res) => {
    con.query(`SELECT * FROM ${constants.plant_species_table} WHERE plant_species="${req.params.plant_species}"`, (err, species) => {
        if (err) console.log(err);
        else {
            const { plant_species, common_name, description, _genus, _order, _class, _phylum, _status } = species[0];
            res.render("plant_species/edit", { plant_species, common_name, description, _genus, _order, _class, _phylum, _status });
        }
    });
});

router.post("/edit/:plant_species", (req, res) => {
    const { plant_species, common_name, description, _genus, _order, _class, _phylum, _status } = req.body;
    console.log(req.body);
    let errors = [];
    if (!common_name, !_genus, !_order, !_class, !_phylum)
        errors.push('Please fill in all required fields');
    if (errors.length > 0)
        res.render("plant_species/edit", { errors, plant_species, common_name, description, _genus, _order, _class, _phylum, _status});
    else {
        let sql = `UPDATE ${constants.plant_species_table} SET common_name="${common_name}", description="${description}", _genus="${_genus}", _order="${_order}", _class="${_class}", _phylum="${_phylum}", _status="${_status}" WHERE plant_species="${req.params.plant_species}"`;
        console.log(sql);
        con.query(sql, function (err, result) {
            if (err) console.log(err);
            else {
                res.redirect('/plant_species/all');
            }
        });
    }
});

router.get("/find", (req, res) => {
    res.render("plant_species/find");
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
    let sql = `SELECT * FROM ${constants.plant_species_table} ${where_clause} ORDER BY ${req.body.sort} LIMIT ${req.body.limit} OFFSET ${req.body.skip};`;
    console.log(sql);
    con.query(sql, (err, result) => {
        if(err) console.log(err);
        else res.render("plant_species/results", { result });
    });
});

router.get("/all", (req, res) => {
    con.query(`SELECT * FROM ${constants.plant_species_table}`, (err, result) => {
        if(err) console.log(err);
        else res.render("plant_species/results",{result});
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
                res.redirect('/plant_species/all');
            }
        });
    }
});

module.exports = router;
