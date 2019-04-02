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
    var sql =
    ``;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Species Table created");
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

app.use(express.urlencoded({
    extended: true
}));

app.use("/", require("./routes"));

app.listen(process.env.PORT || 3000);