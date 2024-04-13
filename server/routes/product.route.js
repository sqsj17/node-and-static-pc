const express = require("express");

const router = express.Router();

router.all("/index.html", (req, res) => {
    res.send("product")
})

module.exports = router;