'use strict';
const express = require('express');
const mysql = require('mysql');
// const flash = require('connect-flash');
const constants = require('./constants');
const secrets = require('./secrets');

const app = express();

const con = mysql.createConnection({
    host: secrets.sql_host,
    user: secrets.sql_user,
    password: secrets.sql_password,
    database: constants.db
});

function create_tables(con) {
    var animal_species_table_sql =
    `CREATE TABLE IF NOT EXISTS ${constants.animal_species_table} 
    ( animal_species VARCHAR(255) NOT NULL PRIMARY KEY,
    common_name VARCHAR(255) NOT NULL,
    description TEXT,
    _genus VARCHAR(255),
    _order VARCHAR(255),
    _class VARCHAR(255),
    _phylum VARCHAR(255),
    _status VARCHAR(100)
    );`;
    con.query(animal_species_table_sql, function (err, result) {
        if (err) throw err;
        console.log("Animal Species Table created");
    });

    var animal_table_sql =
    `CREATE TABLE IF NOT EXISTS ${constants.animals_table} 
    ( animal_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
        name VARCHAR(255), 
        dob DATE, 
        status VARCHAR(100),
        gender VARCHAR(100),
        description TEXT,
        photo BLOB, 
        animal_species VARCHAR(255) NOT NULL REFERENCES animal_species(animal_species),
        location POINT);`;
    con.query(animal_table_sql, function (err, result) {
        if (err) throw err;
        console.log("Animal Table created");
    });

    var plant_species_table_sql =
    `CREATE TABLE IF NOT EXISTS ${constants.plant_species_table} 
    ( plant_species VARCHAR(255) NOT NULL PRIMARY KEY,
    common_name VARCHAR(255) NOT NULL,
    description TEXT,
    _genus VARCHAR(255),
    _order VARCHAR(255),
    _class VARCHAR(255),
    _phylum VARCHAR(255),
    _status VARCHAR(100)
    );`;
    con.query(plant_species_table_sql, function (err, result) {
        if (err) throw err;
        console.log("Plant Species Table created");
    });

    var plants_table_sql =
    `CREATE TABLE IF NOT EXISTS ${constants.plants_table} 
    ( plant_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
        description TEXT,
        number INT, 
        status VARCHAR(100),
        photo BLOB, 
        plant_species VARCHAR(255) REFERENCES plant_species(plant_species),
        location POINT);`;
    con.query(plants_table_sql, function (err, result) {
        if (err) throw err;
        console.log("Plants Table created");
    });

    var area_table_sql =
    `CREATE TABLE IF NOT EXISTS ${constants.area_table} 
    ( name VARCHAR(255) NOT NULL PRIMARY KEY,
    boundary POLYGON);`;
    con.query(area_table_sql, function (err, result) {
        if (err) throw err;
        console.log("Area Table created");
    });
}

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL!");
      con.query(`CREATE DATABASE IF NOT EXISTS ${constants.db}`, function (err, result) {
        if (err) throw err;
        console.log("Database created");
      });
     create_tables(con);
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({
    extended: true
}));

// app.use(flash());
// app.use((req, res, next) => {
//     res.locals.success_msgs = req.flash('success_msgs');
//     res.locals.error_msgs = req.flash('error_msgs');
//     next();
// })

app.get("/", (req, res) => {
    res.render("home");
});
app.get("/admin", (req, res) => {
    res.render("admin/home");
});
app.use("/animals", require("./routes/animals"));
app.use("/animal_species", require("./routes/animal_species"));
app.use("/plants", require("./routes/plants"));
app.use("/plant_species", require("./routes/plant_species"));
app.use("/areas", require("./routes/areas"));
app.get("/*", (req, res)=>{
    res.redirect("/");
});

app.listen(process.env.PORT || 3000);