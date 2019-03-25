'use strict';
const express = require('express');
const mysql = require('mysql');
const constants = require('./constants');

const app = express();

// setting up db
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: `${constants.db}`
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL!");
//   con.query(`CREATE DATABASE IF NOT EXISTS ${constants.db}`, function (err, result) {
//     if (err) throw err;
//     console.log("Database created");
//   });

//   var user_table_sql = 
//   `CREATE TABLE IF NOT EXISTS ${constants.users_table} 
//   ( name VARCHAR(255), 
//     contact VARCHAR(20), 
//     email VARCHAR(255) NOT NULL PRIMARY KEY, 
//     password VARCHAR(255));`;
//   con.query(user_table_sql, function (err, result) {
//     if (err) throw err;
//     console.log("User Table created");
//   });

//   var vendor_table_sql = 
//   `CREATE TABLE IF NOT EXISTS ${constants.vendors_table} 
//   ( vendor_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
//     name VARCHAR(255), 
//     contact VARCHAR(20), 
//     address JSON);`;
//   con.query(vendor_table_sql, function (err, result) {
//     if (err) throw err;
//     console.log("Vendor Table created");
//   });

//   var deals_table_sql = 
//   `CREATE TABLE IF NOT EXISTS ${constants.deals_table} 
//   ( deal_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
//     email VARCHAR(255), 
//     msg TEXT, 
//     photo BLOB, 
//     date DATE, 
//     time TIME, 
//     address JSON, 
//     status VARCHAR(100), 
//     vendor_id INT, 
//     items JSON, 
//     rating INT);`;
//   con.query(deals_table_sql, function (err, result) {
//     if (err) throw err;
//     console.log("Deals Table created");
//   });
});

app.use(express.urlencoded({
  extended: true
}));

app.use("/", require("./routes"));

app.listen(process.env.PORT || 3000);