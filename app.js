'use strict';
const express = require('express');
const mysql = require('mysql');
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
    var species_table_sql =
    `CREATE TABLE IF NOT EXISTS ${constants.species_table} (
    species_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    _species VARCHAR(100), 
    _genus VARCHAR(100), 
    _family VARCHAR(100), 
    _order VARCHAR(100), 
    _class VARCHAR(100), 
    _phylum VARCHAR(100), 
    _kingdom VARCHAR(100), 
    _domain VARCHAR(100), 
    _status VARCHAR(100)
    );`;
    con.query(species_table_sql, function (err, result) {
        if (err) throw err;
        console.log("Species Table created");
    });

    var animals_table_sql =
    `CREATE TABLE IF NOT EXISTS ${constants.animals_table} (
    animal_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(255), 
    photo BLOB, 
    location JSON, 
    species_id INT,
    dob DATE, 
    status VARCHAR(100),
    gender VARCHAR(100),
    description TEXT
    );`;
    con.query(animals_table_sql, function (err, result) {
        if (err) throw err;
        console.log("Animals Table created");
    });
    var location_table_sql =
    `CREATE TABLE IF NOT EXISTS ${constants.location_table} (
    location_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(255)
    );`;
    con.query(location_table_sql, function (err, result) {
        if (err) throw err;
        console.log("Location Table created");
    });

    var coordinates_table_sql =
    `CREATE TABLE IF NOT EXISTS ${constants.coordinates_table} (
    coordinate_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    location_id INT,
    coordinate JSON
    );`;
    con.query(coordinates_table_sql, function (err, result) {
        if (err) throw err;
        console.log("Coordinates Table created");
    });
}
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL!");
    //   con.query(`CREATE DATABASE IF NOT EXISTS ${constants.db}`, function (err, result) {
    //     if (err) throw err;
    //     console.log("Database created");
    //   });
    create_tables(con);
});

app.use(express.urlencoded({
    extended: true
}));

app.use("/", require("./routes"));

app.listen(process.env.PORT || 3000);