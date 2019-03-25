const express = require("express");

var router = express.Router();

router.get("/", (req, res) => {
    res.send("HOME")
})

router.post("/results", (req, res) => {
    res.send("RESULTS")
});

router.get("/show/:id?", (req, res) => {
    res.send("SHOW")
});

router.get("/add", (req, res) => {
    res.send("ADD")
});

router.post("/add", (req, res) => {
    res.send("ADD")
});

router.get("/all", (req, res) => {
    res.send("ALL")
});

router.get("/*", (req, res) => {
    res.redirect("/");
});
module.exports = router;

