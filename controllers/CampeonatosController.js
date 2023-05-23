const express = require("express");
const router = express.Router();
const Campeonatos = require("../models/Campeonatos");
const bcrypt = require('bcryptjs');

router.get("/campeonatos", (req,res) => {
    res.render("admin/campeonatos/index");
});

module.exports = router;
