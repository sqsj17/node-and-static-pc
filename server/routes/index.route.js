const express = require("express");

const router = express.Router();

router.all("/index.html", (req, res) => {
    res.send("hello")
})

router.all("/api/list", (req, res) => {
    res.json({
        code: 200, 
        data: [{
            a: 1
        }]
    })
})

module.exports = router;