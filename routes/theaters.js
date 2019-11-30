var express = require('express');
var router = express.Router();

const Theater = require('../models/theater');

// GET localhost:3000/theaters/pId
router.get('/:pId', (req, res) => {
    Theater.getById(req.params.pId)
        .then((result) => {
            res.send(result)
        }).catch((err) => {
            console.log(err)
        });
})




module.exports = router;