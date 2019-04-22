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
    res.render("areas/find");
});

router.get("/all", (req, res) => {
    con.query(`SELECT * FROM ${constants.area_table}`, (err, result) => {
        if(err) console.log(err);
        else {
            for(let i=0;i<result.length;i++) {
                let a = ''
                result[i].boundary[0].forEach((pt) => {
                    a += pt.x+" "+pt.y+","
                })
                a = a.slice(0,-1);
                result[i].boundary = a;
            };
            res.render("areas/results",{result});
        }
    });
});

router.get("/show/:name", (req, res) => {
    con.query(`SELECT * FROM ${constants.area_table} WHERE name="${req.params.name}"`, (err, area) => {
        if (err) console.log(err);
        else {
            let boundary = ''
            area[0].boundary[0].forEach((pt) => {
                boundary += pt.x+" "+pt.y+",";
            })
            boundary = boundary.slice(0,-1);
            area[0].boundary = boundary;
            res.render("areas/show", { area: area[0] });
        }
    });
});

router.get("/edit/:name", (req, res) => {
    con.query(`SELECT * FROM ${constants.area_table} WHERE name="${req.params.name}"`, (err, area) => {
        if (err) console.log(err);
        else {
            let boundary = '';
            area[0].boundary[0].forEach((pt) => {
                boundary += pt.x+" "+pt.y+",";
            })
            boundary = boundary.slice(0,-1);
            res.render("areas/edit", { name: area[0].name, boundary });
        }
    });
});

router.post("/edit/:name", (req, res) => {
    let errors = [];
    const { name, boundary } = req.body;
    if (!boundary)
        errors.push('Please fill in all required fields');
    if (errors.length > 0)
        res.render("areas/edit", { errors, name, boundary });
    else {
        let sql = `UPDATE ${constants.area_table} SET boundary=ST_GeomFromText("POLYGON((${boundary}))") WHERE name="${req.params.name}"`;
        con.query(sql, function (err, result) {
            if (err) console.log(err);
            else {
                res.redirect('/areas/all');
            }
        });
    }
});

router.get("/add", (req, res) => {
    res.render("areas/add");
});

router.post("/add", (req, res) => {
    const { name, boundary } = req.body;
    let errors = [];
    // let polygon = boundary.split(' '); NOT WORKING !!!!!
    if (!name, !boundary)
        errors.push('Please fill in all required fields');
    if (errors.length > 0)
        res.render("areas/add", { errors, name, boundary });
    else {
        let sql = `INSERT INTO ${constants.area_table} 
                    (
                        name, boundary
                    ) 
                    VALUES
                    (
                        ?, ST_GeomFromText("POLYGON((${boundary}))")
                    )`;
        // Consider the polygon for boundary points
        con.query(sql, [name], function (err, result) {
            if (err) console.log(err);       
            else {
                // req.flash('success_msgs', 'Areas added.');
                res.redirect('/areas/all');
            }
        });
    }
});

module.exports = router;
