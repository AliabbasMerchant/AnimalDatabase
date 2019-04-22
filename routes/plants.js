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

router.get("/show/:id", (req, res) => {
    con.query(`SELECT * FROM ${constants.plants_table} WHERE plant_id=${req.params.id}`, (err, plant) => {
        if (err) console.log(err);
        else {
            let sql =`select name FROM ${constants.area_table}
            where ST_Contains(boundary, (SELECT location from ${constants.plants_table} where plant_id=${req.params.id}));`
            con.query(sql, (err, result)=> {
                if(err) console.log(err);
                else {
                    if(typeof result[0] != 'undefined')
                        plant[0].area = result[0].name;
                    res.render("plants/show", { plant: plant[0] });
                }
            });
        }
    });
});

router.get("/edit/:id", (req, res) => {
    con.query(`SELECT * FROM ${constants.plants_table} WHERE plant_id=${req.params.id}`, (err, plant) => {
        if (err) console.log(err);
        else {
            con.query(`SELECT plant_species FROM ${constants.plant_species_table};`, (err, all_species) => {
                if (err) console.log(err);
                else {
                    const { plant_id, description, number, status, plant_species, location } = plant[0];
                    res.render("plants/edit", { plant_id, description, number, status, plant_species, location, all_species });
                }
            });
        }
    });
});

router.post("/edit/:id", (req, res) => {
    const { description, number, status, plant_species, location } = req.body;
    let errors = [];
    let loc = String(location).split(' ');
    if (!number, !plant_species, !location)
        errors.push('Please fill in all required fields');
    if (errors.length > 0)
        res.render("plants/edit", { errors, description, number, status, plant_species, location, id:req.params.id });
    else {
        var sql = `UPDATE ${constants.plants_table} SET description="${description}", number=${number}, status="${status}", plant_species="${plant_species}", location=POINT(${loc[0]}, ${loc[1]}) WHERE plant_id=${req.params.id}`;
        con.query(sql, function (err, result) {
            if (err) console.log(err.message);
            else {
                res.redirect('/plants/all');
            }
        });
    }
});

router.get("/find", (req, res) => {
    con.query(`SELECT plant_species FROM ${constants.plant_species_table}`, (err, plant_species) => {
        if (err) console.log(err);
        else res.render("plants/find", { plant_species });
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
                if(property == "number") where_clause += `${property}=${req.body[property]} AND `;
                else where_clause += `${property}="${req.body[property]}" AND `;
            }
        }
    }
    where_clause = where_clause.slice(0, -5);
    let sql = `SELECT * FROM ${constants.plants_table} ${where_clause} ORDER BY ${req.body.sort} LIMIT ${req.body.limit} OFFSET ${req.body.skip};`;
    console.log(sql);
    con.query(sql, (err, result) => {
        if (err) console.log(err);
        else res.render("plants/results", { result });
    });
});

router.get("/all", (req, res) => {
    con.query(`SELECT * FROM ${constants.plants_table}`, (err, result) => {
        if(err) console.log(err);
        else res.render("plants/results",{result});
    });
});

router.get("/add", (req, res) => {
    con.query(`SELECT plant_species FROM ${constants.plant_species_table};`, (err, plant_species) => {
        if (err) console.log(err);
        else res.render("plants/add", { plant_species });
    });
});

router.post("/add", (req, res) => {
    const { description, number, status, plant_species, location } = req.body;
    console.log(req.body);
    let errors = [];
    let loc = String(location).split(' '); //Not working !!!!!
    if (!number, !plant_species, !location)
        errors.push('Please fill in all required fields');
    if (errors.length > 0)
        res.render("plants/add", { errors, description, number, status, plant_species, location });
    else {
        let sql = `INSERT INTO ${constants.plants_table} 
                    (
                        description, number, status, plant_species, location
                    ) 
                    VALUES 
                    (
                        ?, ?, ?, ?, POINT(?, ?)
                    )`;
        con.query(sql, [description, number, status, plant_species, loc[0], loc[1]], function (err, result) {
            if (err) console.log(err);       
            else {
                // req.flash('success_msgs', 'Plant added.');
                res.redirect('/plants/all');
            }
        });
    }
});

module.exports = router;
