const express = require("express");
const router = express.Router();
const Times = require("../models/Times");
const bcrypt = require('bcryptjs');

router.get("/times", (req,res) => {
    res.render("admin/times/index");
});

module.exports = router;
